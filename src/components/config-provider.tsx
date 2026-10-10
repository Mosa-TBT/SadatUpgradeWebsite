"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { API_URL } from "@/lib/admin/api";
import { sanitizeNavLinks } from "@/components/nav-links";
import type { PublicConfig, PublicMenus, ThemeTokens } from "@/types";

interface SiteConfigContextValue {
  config: PublicConfig | null;
  menus: PublicMenus | null;
  ready: boolean;
}

const ConfigContext = createContext<SiteConfigContextValue>({
  config: null,
  menus: null,
  ready: false,
});

export function useSiteConfig(): SiteConfigContextValue {
  return useContext(ConfigContext);
}

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<PublicConfig | null>(null);
  const [menus, setMenus] = useState<PublicMenus | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load(): Promise<void> {
      try {
        const [configRes, menusRes] = await Promise.all([
          fetch(`${API_URL}/public/config`, { headers: { Accept: "application/json" } }).then(
            (r) => r.json(),
          ),
          fetch(`${API_URL}/public/menus`, { headers: { Accept: "application/json" } }).then(
            (r) => r.json(),
          ),
        ]);
        if (cancelled) return;
        setConfig((configRes as { data?: PublicConfig })?.data ?? null);
        const menuData = (menusRes as { data?: PublicMenus })?.data ?? null;
        /* Strip obsolete items (Portfolio, Pricing, public Login/Sign Up/Get Started)
           from backend-driven navigation before it can reach any renderer. */
        setMenus(
          menuData
            ? {
                ...menuData,
                header: sanitizeNavLinks(menuData.header),
                footer: sanitizeNavLinks(menuData.footer),
              }
            : null,
        );
        if (configRes && configRes.data && (configRes.data as PublicConfig).theme) {
          applyTheme((configRes.data as PublicConfig).theme);
        }
      } catch {
        // Fail silently â€” the site keeps its built-in defaults.
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => ({ config, menus, ready }), [config, menus, ready]);

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

export function PageViewTracker(): null {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const timer = setTimeout(() => {
      fetch(`${API_URL}/public/page-views`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ path: pathname }),
      }).catch(() => undefined);
    }, 800);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

function applyTheme(theme: ThemeTokens): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const colors = theme.colors ?? {};
  const layout = theme.layout ?? {};
  const typography = theme.typography ?? {};

  const semantic: Record<string, string> = {
    "--background": colors.background,
    "--foreground": colors.text,
    "--card": colors.card,
    "--card-foreground": colors.text,
    "--popover": colors.card,
    "--popover-foreground": colors.text,
    "--primary": colors.primary,
    "--primary-foreground": colors.primary_foreground,
    "--secondary": colors.secondary,
    "--secondary-foreground": colors.secondary_foreground,
    "--muted": colors.surface,
    "--muted-foreground": colors.muted,
    "--accent": colors.accent,
    "--accent-foreground": colors.primary_foreground,
    "--destructive": colors.danger,
    "--destructive-foreground": colors.primary_foreground,
    "--border": colors.border,
    "--input": colors.border,
    "--ring": colors.ring ?? colors.primary,
  };

  for (const [key, hex] of Object.entries(semantic)) {
    const hsl = hexToHsl(hex);
    if (hsl) root.style.setProperty(key, hsl);
  }

  for (const [key, hex] of Object.entries(colors)) {
    if (typeof hex === "string" && hex.startsWith("#")) {
      root.style.setProperty(`--color-${key.replace(/_/g, "-")}`, hex);
    }
  }

  const radius = layout.radius;
  if (radius != null) {
    root.style.setProperty("--radius", radius === "0" ? "0rem" : `${radius}rem`);
  }

  root.style.setProperty("--sidebar-width", `${layout.sidebar_width || 260}px`);
  root.style.setProperty("--header-height", `${layout.header_height || 64}px`);

  if (typography.font_primary) {
    document.body.style.fontFamily = `'${typography.font_primary}', system-ui, -apple-system, sans-serif`;
  }
  if (typography.font_size_base) {
    root.style.setProperty("--font-size-base", `${typography.font_size_base}px`);
  }
}

function hexToHsl(hex?: string): string | null {
  if (!hex || typeof hex !== "string") return null;
  let value = hex.replace("#", "").trim();
  if (value.length === 3) value = value.split("").map((ch) => ch + ch).join("");
  if (value.length !== 6) return null;

  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  const d = max - min;

  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r:
        h = ((g - b) / d) % 6;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}