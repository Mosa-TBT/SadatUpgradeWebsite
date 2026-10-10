"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User as UserIcon,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { adminNav } from "@/lib/admin/nav";
import { api } from "@/lib/admin/api";
import { useAdminAuth } from "@/components/admin/auth-provider";
import { cn } from "@/lib/utils";
import type { ApiEnvelope } from "@/types";

export interface AdminNavBase {
  label: string;
  href: string;
  exact?: boolean;
}

export interface AdminNavChild extends AdminNavBase {
  permission?: string;
  icon?: LucideIcon;
}

export interface AdminNavItem extends AdminNavChild {
  children?: AdminNavChild[];
}

export interface NotificationItem {
  id: number;
  created_at: string;
  data?: { title?: string; message?: string } | null;
}

export interface NotificationsPayload {
  unread: number;
  notifications: { data: NotificationItem[] };
}

export interface SearchResultItem {
  href: string;
  title: string;
  subtitle?: string;
}

export interface SearchGroup {
  label: string;
  items: SearchResultItem[];
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, can } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setNotifOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const visibleNav = useMemo(() => {
    return (adminNav as AdminNavItem[])
      .map((item) => {
        if (item.children) {
          const children = item.children.filter((c) => can(c.permission));
          return children.length ? { ...item, children } : null;
        }
        return can(item.permission) ? item : null;
      })
      .filter(Boolean) as AdminNavItem[];
  }, [can]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-200 bg-white transition-transform",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
              S
            </span>
            <span className="text-base font-bold tracking-tight">Sadat Admin</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="text-gray-400 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {visibleNav.map((item) =>
            item.children ? (
              <NavGroup key={item.label} item={item} pathname={pathname} />
            ) : (
              <NavLink key={item.label} item={item} active={isActive(pathname, item)} />
            ),
          )}
        </nav>
        <div className="border-t border-gray-100 p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            <ExternalLink className="h-4 w-4" /> View website
          </Link>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="relative flex-1 max-w-xl">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-100"
            >
              <Search className="h-4 w-4" />
              <span>Search…</span>
              <kbd className="ml-auto hidden rounded border border-gray-300 bg-white px-1.5 py-0.5 text-[10px] text-gray-500 sm:inline">
                /
              </kbd>
            </button>
          </div>

          <div className="ml-auto flex items-center gap-1">
            <NotificationBell open={notifOpen} setOpen={setNotifOpen} />
            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-gray-100"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700">
                  {user?.name?.slice(0, 1)?.toUpperCase() || "A"}
                </span>
                <span className="hidden text-sm font-medium sm:block">{user?.name}</span>
                <ChevronDown className="hidden h-4 w-4 text-gray-400 sm:block" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="truncate text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link
                    href="/admin/profile"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <UserIcon className="h-4 w-4" /> Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} router={router} />
    </div>
  );
}

function isActive(pathname: string, item: AdminNavBase): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

function NavLink({ item, active }: { item: AdminNavChild; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
        active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {item.label}
    </Link>
  );
}

function NavGroup({ item, pathname }: { item: AdminNavItem; pathname: string }) {
  const hasActive = (item.children ?? []).some((c) => isActive(pathname, c));
  const [open, setOpen] = useState(hasActive);
  const Icon = item.icon;

  useEffect(() => {
    if (hasActive) setOpen(true);
  }, [hasActive]);

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition",
          hasActive ? "text-gray-900" : "text-gray-600 hover:bg-gray-50",
        )}
      >
        {Icon && <Icon className="h-4 w-4" />}
        {item.label}
        <ChevronRight className={cn("ml-auto h-4 w-4 text-gray-400 transition", open && "rotate-90")} />
      </button>
      {open && (
        <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-3">
          {(item.children ?? []).map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition",
                isActive(pathname, child)
                  ? "bg-blue-50 font-medium text-blue-700"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationBell({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [data, setData] = useState<NotificationsPayload>({ unread: 0, notifications: { data: [] } });

  const load = async () => {
    try {
      const res = await api.get<ApiEnvelope<NotificationsPayload>>("/admin/notifications");
      setData(res.data);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markAll = async () => {
    await api.post("/admin/notifications/read-all");
    load();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
      >
        <Bell className="h-5 w-5" />
        {data.unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {data.unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-semibold">Notifications</p>
            {data.unread > 0 && (
              <button onClick={markAll} className="text-xs font-medium text-blue-600 hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {(data.notifications?.data || []).length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-gray-400">No notifications</p>
            ) : (
              data.notifications.data.map((n) => (
                <div key={n.id} className="border-b border-gray-50 px-4 py-3 last:border-0">
                  <p className="text-sm font-medium text-gray-800">
                    {n.data?.title || n.data?.message || "Notification"}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">{new Date(n.created_at).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function GlobalSearch({
  open,
  onClose,
  router,
}: {
  open: boolean;
  onClose: () => void;
  router: AppRouterInstance;
}) {
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState<SearchGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setGroups([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setGroups([]);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get<ApiEnvelope<SearchGroup[]>>(`/admin/search?q=${encodeURIComponent(query.trim())}`);
        setGroups(res.data || []);
      } catch {
        setGroups([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-gray-900/50 p-4 sm:p-10" onClick={onClose}>
      <div
        className="mx-auto max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-gray-100 px-4">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users, pages, posts, media…"
            className="flex-1 py-4 text-sm focus:outline-none"
          />
        </div>
        <div className="max-h-96 overflow-y-auto p-2">
          {loading && <p className="px-3 py-4 text-center text-sm text-gray-400">Searching…</p>}
          {!loading && query.length >= 2 && groups.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-gray-400">No results</p>
          )}
          {groups.map((group) => (
            <div key={group.label} className="mb-1">
              <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                {group.label}
              </p>
              {group.items.map((item) => (
                <button
                  key={item.href + item.title}
                  onClick={() => {
                    router.push(item.href);
                    onClose();
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-800">{item.title}</span>
                  <span className="text-xs text-gray-400">{item.subtitle}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}