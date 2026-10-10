export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

const TOKEN_KEY = "sadat_admin_token";

export interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  isForm?: boolean;
}

export class ApiError extends Error {
  readonly status: number;
  readonly errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export function asApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  return new ApiError(error instanceof Error ? error.message : "Request failed", 0);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

async function request<T = unknown>(
  path: string,
  { method = "GET", body, headers = {}, isForm = false }: RequestOptions = {},
): Promise<T> {
  const token = getToken();
  const finalHeaders: Record<string, string> = { Accept: "application/json", ...headers };
  if (token) finalHeaders.Authorization = `Bearer ${token}`;

  let payload: BodyInit | undefined;
  if (body !== undefined) {
    payload = isForm ? (body as BodyInit) : JSON.stringify(body);
    if (!isForm) finalHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: payload,
  });

  if (response.status === 401 && !path.startsWith("/auth/login")) {
    setToken(null);
    if (typeof window !== "undefined" && !window.location.pathname.endsWith("/admin/login")) {
      window.location.href = "/admin/login";
    }
  }

  const contentType = response.headers.get("content-type") ?? "";
  const data: unknown = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text();

  if (!response.ok) {
    const envelope = data as { message?: string; errors?: Record<string, string[]> } | null;
    throw new ApiError(
      envelope?.message ?? `Request failed with status ${response.status}`,
      response.status,
      envelope?.errors,
    );
  }

  return data as T;
}

export const api = {
  get: <T = unknown>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T = unknown>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T = unknown>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  del: <T = unknown>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
  upload: <T = unknown>(path: string, formData: FormData) =>
    request<T>(path, { method: "POST", body: formData, isForm: true }),
};

export { request as rawRequest };