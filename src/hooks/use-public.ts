"use client";

import { useCallback, useEffect, useState } from "react";
import { API_URL } from "@/lib/admin/api";
import type { ApiEnvelope, Paginated } from "@/types";

export interface UsePublicResult<T> {
  /* Backwards-compatible name used by most consumers. */
  items: T[];
  /* The Home page's data-driven sections read `{ data }` from the hook. */
  data: T[];
  loading: boolean;
  error: string;
  reload: () => void;
}

/**
 * Fetches a public CMS collection from the same Laravel API the Admin Panel
 * writes to. `cache: "no-store"` guarantees a round-trip to the backend on
 * every load, so admin changes appear immediately on the next visit/refresh.
 */
export function usePublic<T = Record<string, unknown>>(collection: string): UsePublicResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/public/${collection}`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Request failed");
      const body = (await res.json()) as ApiEnvelope<T[] | Paginated<T>>;
      const data = Array.isArray(body?.data) ? body.data : body?.data?.data ?? [];
      setItems(data);
      setError("");
    } catch {
      setError("Unable to load content. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [collection]);

  useEffect(() => {
    load();
  }, [load]);

  return { items, data: items, loading, error, reload: load };
}