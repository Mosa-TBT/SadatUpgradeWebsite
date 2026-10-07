"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { API_URL } from "@/lib/admin/api";

const ConfigContext = createContext({ config: null, menus: null, ready: false });

export function useSiteConfig() {
  return useContext(ConfigContext);
}

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [menus, setMenus] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [configRes, menusRes] = await Promise.all([
          fetch(`${API_URL}/public/config`, { headers: { Accept: "application/json" } }).then((r) => r.json()),
          fetch(`${API_URL}/public/menus`, { headers: { Accept: "application/json" } }).then((r) => r.json()),
        ]);
        if (cancelled) return;
        setConfig(configRes?.data || null);
        setMenus(menusRes?.data || null);
        if (configRes?.data?.theme) applyTheme(configRes.data.theme);
      } catch {
        // Fail silently — the site keeps its built-in defaults.
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

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const timer = setTimeout(() => {
      fetch(`${API_URL}/public/page-views`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ path: pathname }),
      }).catch(() => {});
    }, 800);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

function applyTheme(theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const c = theme.colors || {};
  const layout = theme.layout || {};
  const typography = theme.typography || {};

  const semantic = {
    "--background": c.background,
    "--foreground": c.text,
    "--card": c.card,
    "--card-foreground": c.text,
    "--popover": c.card,
    "--popover-foreground": c.text,
    "--primary": c.primary,
    "--primary-foreground": c.primary_foreground,
    "--secondary": c.secondary,
    "--secondary-foreground": c.secondary_foreground,
    "--muted": c.surface,
    "--muted-foreground": c.muted,
    "--accent": c.accent,
    "--accent-foreground": c.primary_foreground,
    "--destructive": c.danger,
    "--destructive-foreground": c.primary_foreground,
    "--border": c.border,
    "--input": c.border,
    "--ring": c.ring || c.primary,
  };

  Object.entries(semantic).forEach(([key, hex]) => {
    const hsl = hexToHsl(hex);
    if (hsl) root.style.setProperty(key, hsl);
  });

  // Expose the raw design tokens too, for future components.
  Object.entries(c).forEach(([key, hex]) => {
    if (typeof hex === "string" && hex.startsWith("#")) {
      root.style.setProperty(`--color-${key.replace(/_/g, "-")}`, hex);
    }
  });

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

function hexToHsl(hex) {
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
      case r: h = ((g - b) / d) % 6; break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}
