"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { api, getToken, setToken } from "@/lib/admin/api";
import type { AdminUser, ApiEnvelope } from "@/types";

export interface AdminAuthContextValue {
  user: AdminUser | null;
  setUser: Dispatch<SetStateAction<AdminUser | null>>;
  loading: boolean;
  login: (email: string, password: string, deviceName?: string) => Promise<AdminUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<AdminUser | null>;
  can: (permission?: string) => boolean;
  canAny: (permissions?: string[]) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async (): Promise<AdminUser | null> => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return null;
    }
    try {
      const res = await api.get<ApiEnvelope<AdminUser>>("/auth/me");
      setUser(res.data);
      return res.data;
    } catch {
      setToken(null);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(
    async (email: string, password: string, deviceName?: string): Promise<AdminUser> => {
      const res = await api.post<ApiEnvelope<{ token: string; user: AdminUser }>>("/auth/login", {
        email,
        password,
        device_name: deviceName || "admin-panel",
      });
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch {
      /* ignore */
    }
    setToken(null);
    setUser(null);
    router.push("/admin/login");
  }, [router]);

  const can = useCallback(
    (permission?: string): boolean => {
      if (!user) return false;
      if (user.is_super_admin) return true;
      if (!permission) return true;
      return (user.permissions || []).includes(permission);
    },
    [user],
  );

  const canAny = useCallback(
    (permissions: string[] = []): boolean => permissions.some((p) => can(p)),
    [can],
  );

  const value = useMemo<AdminAuthContextValue>(
    () => ({ user, setUser, loading, login, logout, refresh: loadUser, can, canAny }),
    [user, loading, login, logout, loadUser, can, canAny],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}