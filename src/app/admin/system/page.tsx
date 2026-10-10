"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Database, Server, Cpu, HardDrive, RefreshCw, Wrench, Trash2 } from "lucide-react";
import { api } from "@/lib/admin/api";
import { useAdminAuth } from "@/components/admin/auth-provider";
import { useToast } from "@/components/admin/toast";
import { PageHeader, SectionCard, StatCard, Spinner, ConfirmDialog } from "@/components/admin/ui";
import type { ApiEnvelope } from "@/types";

interface CacheAction {
  action: string;
  label: string;
  destructive: boolean;
}

const CACHE_ACTIONS: CacheAction[] = [
  { action: "clear_cache", label: "Clear application cache", destructive: true },
  { action: "clear_config", label: "Clear config cache", destructive: false },
  { action: "cache_config", label: "Cache configuration", destructive: false },
  { action: "clear_route", label: "Clear route cache", destructive: false },
  { action: "clear_view", label: "Clear compiled views", destructive: false },
  { action: "optimize", label: "Optimize (clear all)", destructive: true },
  { action: "clear_logs", label: "Clear log files", destructive: true },
];

interface SystemInfo {
  runtime: {
    laravel_version: string;
    php_version: string;
    os: string;
    extensions?: string[];
  };
  database: {
    status: string;
    driver: string;
    name: string;
    version?: string | null;
    size_mb?: number | null;
  };
  storage: {
    media_size_mb: number;
    media_files: number;
    disk: string;
    free_space?: string | null;
  };
  application: {
    name: string;
    version: string;
    environment: string;
    debug: boolean;
    url: string;
    timezone: string;
    server_time: string;
    maintenance: boolean;
  };
  cache: { store: string; status: string };
  queue: { connection: string; status: string };
}

export default function SystemPage() {
  const { can } = useAdminAuth();
  const toast = useToast();
  const [info, setInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<CacheAction | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiEnvelope<SystemInfo>>("/admin/system/info");
      setInfo(res.data);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const runAction = async (action: string) => {
    setBusy(action);
    setConfirm(null);
    try {
      const res = await api.post<ApiEnvelope<unknown>>("/admin/system/cache", { action });
      toast.success(res.message);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  };

  const toggleMaintenance = async () => {
    const enabled = !info?.application?.maintenance;
    try {
      await api.post("/admin/system/maintenance", { enabled });
      toast.success(enabled ? "Maintenance mode enabled" : "Maintenance mode disabled");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  };

  if (loading || !info) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="h-7 w-7" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="System Information"
        description="Environment, database and runtime diagnostics."
        actions={
          <button onClick={load} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Laravel" value={info.runtime.laravel_version} icon={Server} accent="red" />
        <StatCard label="PHP" value={info.runtime.php_version} icon={Cpu} accent="purple" />
        <StatCard label="Database" value={info.database.status} hint={info.database.driver} icon={Database} accent={info.database.status === "connected" ? "emerald" : "red"} />
        <StatCard label="Media size" value={`${info.storage.media_size_mb} MB`} hint={`${info.storage.media_files} files`} icon={HardDrive} accent="amber" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard title="Application">
          <InfoRows rows={[
            ["Name", info.application.name],
            ["Version", info.application.version],
            ["Environment", info.application.environment],
            ["Debug mode", info.application.debug ? "Enabled" : "Disabled"],
            ["URL", info.application.url],
            ["Timezone", info.application.timezone],
            ["Server time", new Date(info.application.server_time).toLocaleString()],
          ]} />
        </SectionCard>

        <SectionCard title="Runtime">
          <InfoRows rows={[
            ["PHP Version", info.runtime.php_version],
            ["Laravel Version", info.runtime.laravel_version],
            ["OS Family", info.runtime.os],
            ["Extensions", (info.runtime.extensions || []).join(", ")],
          ]} />
        </SectionCard>

        <SectionCard title="Database">
          <InfoRows rows={[
            ["Driver", info.database.driver],
            ["Database", info.database.name],
            ["Status", info.database.status],
            ["Version", info.database.version || "—"],
            ["Size", info.database.size_mb != null ? `${info.database.size_mb} MB` : "—"],
          ]} />
        </SectionCard>

        <SectionCard title="Cache, queue & storage">
          <InfoRows rows={[
            ["Cache store", `${info.cache.store} (${info.cache.status})`],
            ["Queue connection", `${info.queue.connection} (${info.queue.status})`],
            ["Default disk", info.storage.disk],
            ["Disk free space", info.storage.free_space || "—"],
          ]} />
        </SectionCard>
      </div>

      {can("system.manage") && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <SectionCard title="Maintenance mode" description="Show a maintenance notice on the public website.">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {info.application.maintenance ? "Maintenance mode is currently ON" : "Maintenance mode is OFF"}
              </p>
              <button
                onClick={toggleMaintenance}
                className={"rounded-lg px-4 py-2 text-sm font-medium text-white " + (info.application.maintenance ? "bg-emerald-600 hover:bg-emerald-700" : "bg-amber-600 hover:bg-amber-700")}
              >
                {info.application.maintenance ? "Disable" : "Enable"}
              </button>
            </div>
          </SectionCard>

          <SectionCard title="Cache management">
            <div className="grid gap-2 sm:grid-cols-2">
              {CACHE_ACTIONS.map((item) => (
                <button
                  key={item.action}
                  onClick={() => (item.destructive ? setConfirm(item) : runAction(item.action))}
                  className={"inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition " + (item.destructive ? "border-red-200 text-red-700 hover:bg-red-50" : "border-gray-200 text-gray-700 hover:bg-gray-50")}
                >
                  {busy === item.action ? <Spinner className="h-4 w-4" /> : item.destructive ? <Trash2 className="h-4 w-4" /> : <Wrench className="h-4 w-4" />}
                  {item.label}
                </button>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => confirm && runAction(confirm.action)}
        title={confirm?.label}
        description="This may briefly interrupt the application. Continue?"
        confirmLabel="Run"
      />
    </div>
  );
}

function InfoRows({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="divide-y divide-gray-100">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-start justify-between gap-4 py-2.5 text-sm">
          <dt className="text-gray-500">{label}</dt>
          <dd className="break-all text-right font-medium text-gray-800">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
