"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getToken, setToken } from "@/lib/admin/api";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return null;
    }
    try {
      const res = await api.get("/auth/me");
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

  const login = useCallback(async (email, password, deviceName) => {
    const res = await api.post("/auth/login", {
      email,
      password,
      device_name: deviceName || "admin-panel",
    });
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const logout = useCallback(async () => {
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
    (permission) => {
      if (!user) return false;
      if (user.is_super_admin) return true;
      if (!permission) return true;
      return (user.permissions || []).includes(permission);
    },
    [user],
  );

  const canAny = useCallback(
    (permissions = []) => permissions.some((p) => can(p)),
    [can],
  );

  const value = useMemo(
    () => ({ user, setUser, loading, login, logout, refresh: loadUser, can, canAny }),
    [user, loading, login, logout, loadUser, can, canAny],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}
