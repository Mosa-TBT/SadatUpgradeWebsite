export interface NavLikeItem {
  label: string;
  url?: string;
  href?: string;
  children?: NavLikeItem[];
}

const FORBIDDEN_SEGMENTS = new Set([
  "portfolio",
  "portfolios",
  "pricing",
  "login",
  "log-in",
  "register",
  "signup",
  "sign-up",
  "signin",
  "sign-in",
  "forgot-password",
  "reset-password",
  "blog",
  "careers",
  "privacy",
  "privacy-policy",
  "terms",
  "terms-of-service",
  "dashboard",
]);

const FORBIDDEN_LABELS = new Set([
  normalizeLabel("Portfolio"),
  normalizeLabel("Portfolios"),
  normalizeLabel("Pricing"),
  normalizeLabel("Login"),
  normalizeLabel("Log In"),
  normalizeLabel("Log-in"),
  normalizeLabel("Sign In"),
  normalizeLabel("Sign In Up"),
  normalizeLabel("Sign-in"),
  normalizeLabel("Sign Up"),
  normalizeLabel("Sign-up"),
  normalizeLabel("Register"),
  normalizeLabel("Get Started"),
  normalizeLabel("Get Started Now"),
  normalizeLabel("Blog"),
  normalizeLabel("Our Blog"),
  normalizeLabel("Careers"),
  normalizeLabel("Privacy"),
  normalizeLabel("Privacy Policy"),
  normalizeLabel("Terms"),
  normalizeLabel("Terms of Service"),
]);

function normalizeLabel(label: string): string {
  return label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function firstPathSegment(url: string): string {
  try {
    const pathname = new URL(url, "https://placeholder.local").pathname;
    return pathname.split("/").filter(Boolean)[0]?.toLowerCase() ?? "";
  } catch {
    return url.split(/[/?#]/).filter(Boolean)[0]?.toLowerCase() ?? "";
  }
}

export function isForbiddenNavItem(item: NavLikeItem): boolean {
  if (FORBIDDEN_LABELS.has(normalizeLabel(item.label))) return true;

  const target = item.url ?? item.href ?? "";
  if (!target || target.startsWith("mailto:") || target.startsWith("tel:")) return false;

  return FORBIDDEN_SEGMENTS.has(firstPathSegment(target));
}

/**
 * Recursively strips obsolete navigation items (Portfolio, Pricing, public
 * Login/Sign Up/Register/Get Started) from any menu source — including the
 * backend-driven `menus` payload consumed by the site header. Prevents those
 * routes from ever rendering, regardless of where the menu data originates.
 */
export function sanitizeNavLinks<T extends NavLikeItem>(items: T[] | null | undefined): T[] {
  if (!Array.isArray(items)) return [];
  const output: T[] = [];
  for (const item of items) {
    if (isForbiddenNavItem(item)) continue;
    const children = sanitizeNavLinks<T>(item.children as T[] | undefined);
    output.push({
      ...item,
      children: children.length > 0 ? children : undefined,
    } as T);
  }
  return output;
}