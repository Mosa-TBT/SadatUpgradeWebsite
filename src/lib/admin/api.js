const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const TOKEN_KEY = "sadat_admin_token";

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

async function request(path, { method = "GET", body, headers = {}, isForm } = {}) {
  const token = getToken();
  const finalHeaders = { Accept: "application/json", ...headers };

  if (token) finalHeaders.Authorization = `Bearer ${token}`;

  let payload = body;
  if (body && !isForm) {
    finalHeaders["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
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

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text();

  if (!response.ok) {
    const message =
      (data && data.message) || `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, data && data.errors);
  }

  return data;
}

export const api = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) =>
    request(path, { ...options, method: "POST", body }),
  put: (path, body, options) =>
    request(path, { ...options, method: "PUT", body }),
  del: (path, options) => request(path, { ...options, method: "DELETE" }),
  upload: (path, formData) =>
    request(path, { method: "POST", body: formData, isForm: true }),
};

export { API_URL };
