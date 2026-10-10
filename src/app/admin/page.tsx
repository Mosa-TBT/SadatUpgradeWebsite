"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  UserPlus,
  Eye,
  FileText,
  Newspaper,
  FolderKanban,
  Briefcase,
  Mail,
  Image as ImageIcon,
  ShieldAlert,
  Settings2,
  Activity,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "@/lib/admin/api";
import { useAdminAuth } from "@/components/admin/auth-provider";
import { useToast } from "@/components/admin/toast";
import { PageHeader, SectionCard, StatCard, Skeleton, Modal, Spinner, StatusBadge } from "@/components/admin/ui";
import type { ApiEnvelope } from "@/types";

interface DashboardWidget {
  widget_key: string;
  is_visible: boolean;
  sort_order: number;
}

interface DashboardSeriesPoint {
  date: string;
  value: number;
}

interface DashboardStats {
  users: { total: number; new: number; active: number };
  page_views: number;
  contacts: { new: number; total: number };
  pages: { total: number; published: number };
  posts: { total: number; published: number };
  projects: number;
  media: number;
}

interface DashboardTopPage {
  path: string;
  views: number;
}

interface DashboardActivity {
  id: number;
  event: string;
  user?: { name?: string } | null;
  created_at: string;
}

interface DashboardRecentUser {
  id: number;
  name: string;
  email: string;
  status: string;
}

interface DashboardLogin {
  id: number;
  email: string;
  ip_address?: string | null;
  status: string;
  created_at: string;
}

interface DashboardSecurity {
  failed_logins: number;
  successful_logins: number;
}

interface DashboardData {
  stats: DashboardStats;
  series?: {
    users?: DashboardSeriesPoint[];
    page_views?: DashboardSeriesPoint[];
  };
  top_pages: DashboardTopPage[];
  recent_activity: DashboardActivity[];
  recent_users: DashboardRecentUser[];
  login_activity: DashboardLogin[];
  security: DashboardSecurity;
}

interface DashboardChartPoint {
  date: string;
  users: number;
  views: number;
}

interface WidgetContext {
  stats: DashboardStats;
  chartData: DashboardChartPoint[];
  data: DashboardData;
}

const DEFAULT_WIDGETS: DashboardWidget[] = [
  { widget_key: "stats", is_visible: true, sort_order: 0 },
  { widget_key: "traffic", is_visible: true, sort_order: 1 },
  { widget_key: "content", is_visible: true, sort_order: 2 },
  { widget_key: "top_pages", is_visible: true, sort_order: 3 },
  { widget_key: "recent_activity", is_visible: true, sort_order: 4 },
  { widget_key: "recent_users", is_visible: true, sort_order: 5 },
  { widget_key: "login_activity", is_visible: true, sort_order: 6 },
  { widget_key: "security", is_visible: true, sort_order: 7 },
];

const WIDGET_LABELS: Record<string, string> = {
  stats: "Key metrics",
  traffic: "Traffic & growth",
  content: "Content overview",
  top_pages: "Top pages",
  recent_activity: "Recent activity",
  recent_users: "Recent users",
  login_activity: "Login activity",
  security: "Security events",
};

export default function AdminDashboardPage() {
  const { user } = useAdminAuth();
  const toast = useToast();
  const [range, setRange] = useState("30d");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [widgets, setWidgets] = useState<DashboardWidget[]>(DEFAULT_WIDGETS);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [savingLayout, setSavingLayout] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiEnvelope<DashboardData>>(`/admin/dashboard/overview?range=${range}`);
      setData(res.data);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [range, toast]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    api
      .get<ApiEnvelope<DashboardWidget[]>>("/admin/dashboard/layout")
      .then((res) => {
        const saved = res.data || [];
        if (saved.length) {
          const merged = DEFAULT_WIDGETS.map((w) => {
            const found = saved.find((s) => s.widget_key === w.widget_key);
            return found ? { ...w, ...found } : w;
          });
          setWidgets([...merged].sort((a, b) => a.sort_order - b.sort_order));
        }
      })
      .catch(() => {});
  }, []);

  const saveLayout = async () => {
    setSavingLayout(true);
    try {
      await api.put("/admin/dashboard/layout", {
        widgets: widgets.map((w, i) => ({
          widget_key: w.widget_key,
          sort_order: i,
          is_visible: !!w.is_visible,
        })),
      });
      toast.success("Dashboard layout saved");
      setCustomizeOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setSavingLayout(false);
    }
  };

  const stats = data?.stats;
  const chartData = useMemo<DashboardChartPoint[]>(() => {
    if (!data) return [];
    const users = data.series?.users || [];
    const views = data.series?.page_views || [];
    return users.map((u, i) => ({
      date: u.date,
      users: u.value,
      views: views[i]?.value ?? 0,
    }));
  }, [data]);

  const visibleWidgets = widgets.filter((w) => w.is_visible).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] || "Admin"}`}
        description="Here's what is happening across your website."
        actions={
          <>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="today">Today</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="year">Last year</option>
            </select>
            <button
              onClick={() => setCustomizeOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Settings2 className="h-4 w-4" /> Customize
            </button>
          </>
        }
      />

      {loading || !data || !stats ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
          <Skeleton className="h-72" />
        </div>
      ) : (
        <div className="space-y-6">
          {visibleWidgets.map((widget) => (
            <div key={widget.widget_key}>
              {renderWidget(widget.widget_key, { stats, chartData, data })}
            </div>
          ))}
        </div>
      )}

      <Modal
        open={customizeOpen}
        onClose={() => setCustomizeOpen(false)}
        title="Customize dashboard"
        size="sm"
        footer={
          <>
            <button
              onClick={() => setCustomizeOpen(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={saveLayout}
              disabled={savingLayout}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {savingLayout && <Spinner className="text-white" />} Save layout
            </button>
          </>
        }
      >
        <div className="space-y-2">
          {widgets.map((widget, index) => (
            <div
              key={widget.widget_key}
              className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2"
            >
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!widget.is_visible}
                  onChange={(e) =>
                    setWidgets((prev) =>
                      prev.map((w) =>
                        w.widget_key === widget.widget_key ? { ...w, is_visible: e.target.checked } : w,
                      ),
                    )
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                {WIDGET_LABELS[widget.widget_key] || widget.widget_key}
              </label>
              <div className="flex gap-1">
                <button
                  disabled={index === 0}
                  onClick={() =>
                    setWidgets((prev) => swap(prev, index, index - 1))
                  }
                  className="rounded p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  disabled={index === widgets.length - 1}
                  onClick={() => setWidgets((prev) => swap(prev, index, index + 1))}
                  className="rounded p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

function swap<T>(list: T[], a: number, b: number): T[] {
  const next = [...list];
  [next[a], next[b]] = [next[b], next[a]];
  return next;
}

function renderWidget(key: string, { stats, chartData, data }: WidgetContext): ReactNode {
  switch (key) {
    case "stats":
      return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Users" value={stats.users.total} hint={`${stats.users.new} new`} icon={Users} accent="blue" />
          <StatCard label="Active Users" value={stats.users.active} icon={UserCheck} accent="emerald" />
          <StatCard label="Page Views" value={stats.page_views} hint="In selected range" icon={Eye} accent="purple" />
          <StatCard label="New Contacts" value={stats.contacts.new} hint={`${stats.contacts.total} total`} icon={Mail} accent="amber" />
        </div>
      );
    case "traffic":
      return (
        <SectionCard title="Traffic & growth" description="New users and page views over time">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} minTickGap={24} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Area type="monotone" dataKey="views" name="Page views" stroke="#7c3aed" fill="url(#viewsGradient)" strokeWidth={2} />
                <Area type="monotone" dataKey="users" name="New users" stroke="#2563eb" fill="url(#usersGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      );
    case "content":
      return (
        <SectionCard title="Content overview">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Pages" value={stats.pages.total} hint={`${stats.pages.published} published`} icon={FileText} accent="blue" />
            <StatCard label="Posts" value={stats.posts.total} hint={`${stats.posts.published} published`} icon={Newspaper} accent="emerald" />
            <StatCard label="Projects" value={stats.projects} icon={FolderKanban} accent="purple" />
            <StatCard label="Media Files" value={stats.media} icon={ImageIcon} accent="amber" />
          </div>
        </SectionCard>
      );
    case "top_pages":
      return (
        <SectionCard title="Top pages" description="Most visited paths in the selected range">
          {data.top_pages.length === 0 ? (
            <p className="text-sm text-gray-400">No page views recorded yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {data.top_pages.map((p) => (
                <li key={p.path} className="flex items-center justify-between py-2 text-sm">
                  <span className="truncate font-medium text-gray-700">{p.path}</span>
                  <span className="text-gray-400">{p.views} views</span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      );
    case "recent_activity":
      return (
        <SectionCard title="Recent activity">
          <ul className="space-y-3">
            {data.recent_activity.map((a) => (
              <li key={a.id} className="flex items-start gap-3 text-sm">
                <span className="mt-1 rounded-full bg-blue-50 p-1.5 text-blue-600">
                  <Activity className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="font-medium text-gray-800">{a.event}</p>
                  <p className="text-xs text-gray-400">
                    {a.user?.name || "System"} · {new Date(a.created_at).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
            {data.recent_activity.length === 0 && <p className="text-sm text-gray-400">No activity yet.</p>}
          </ul>
        </SectionCard>
      );
    case "recent_users":
      return (
        <SectionCard
          title="Recent users"
          actions={
            <Link href="/admin/users" className="text-sm font-medium text-blue-600 hover:underline">
              View all
            </Link>
          }
        >
          <ul className="divide-y divide-gray-100">
            {data.recent_users.map((u) => (
              <li key={u.id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <p className="font-medium text-gray-800">{u.name}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
                <StatusBadge status={u.status} />
              </li>
            ))}
          </ul>
        </SectionCard>
      );
    case "login_activity":
      return (
        <SectionCard title="Login activity">
          <ul className="divide-y divide-gray-100">
            {data.login_activity.map((l) => (
              <li key={l.id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <p className="font-medium text-gray-800">{l.email}</p>
                  <p className="text-xs text-gray-400">
                    {l.ip_address} · {new Date(l.created_at).toLocaleString()}
                  </p>
                </div>
                <StatusBadge status={l.status} />
              </li>
            ))}
            {data.login_activity.length === 0 && <p className="text-sm text-gray-400">No logins yet.</p>}
          </ul>
        </SectionCard>
      );
    case "security":
      return (
        <SectionCard title="Security events" description="In the selected range">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard label="Failed logins" value={data.security.failed_logins} icon={ShieldAlert} accent="red" />
            <StatCard label="Successful logins" value={data.security.successful_logins} icon={UserCheck} accent="emerald" />
          </div>
        </SectionCard>
      );
    default:
      return null;
  }
}
