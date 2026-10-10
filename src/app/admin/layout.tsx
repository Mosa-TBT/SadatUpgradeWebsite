"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminAuthProvider, useAdminAuth } from "@/components/admin/auth-provider";
import { ToastProvider } from "@/components/admin/toast";
import { AdminShell } from "@/components/admin/admin-shell";
import { Spinner } from "@/components/admin/ui";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AdminAuthProvider>
        <AdminGuard>{children}</AdminGuard>
      </AdminAuthProvider>
    </ToastProvider>
  );
}

function AdminGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !user && !isLogin) {
      router.replace("/admin/login");
    }
  }, [loading, user, isLogin, router]);

  if (isLogin) return children;

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Spinner className="h-7 w-7" />
          <p className="text-sm">Loading admin…</p>
        </div>
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
