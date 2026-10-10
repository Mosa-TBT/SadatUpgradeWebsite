"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Activity } from "lucide-react";
import { api } from "@/lib/admin/api";
import { useToast } from "@/components/admin/toast";
import { PageHeader, StatusBadge, EmptyState } from "@/components/admin/ui";
import { DataTable } from "@/components/admin/data-table";
import type { ApiEnvelope, Paginated } from "@/types";

interface LoginRow {
  id: number;
  email: string;
  user?: { name?: string } | null;
  status: string;
  ip_address?: string | null;
  created_at: string;
}

interface PaginationMeta {
  page: number;
  lastPage: number;
  total: number;
}

export default function LoginsPage() {
  const toast = useToast();
  const [rows, setRows] = useState<LoginRow[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, lastPage: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), per_page: "20" });
      if (search) params.set("search", search);
      if (status) params.set("status", status);
      const res = await api.get<ApiEnvelope<Paginated<LoginRow>>>(`/admin/login-activities?${params.toString()}`);
      setRows(res.data.data || []);
      setMeta({ page: res.data.current_page, lastPage: res.data.last_page, total: res.data.total });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [page, search, status, toast]);

  useEffect(() => {
    const t = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  return (
    <div>
      <PageHeader title="Login Activity" description="Successful and failed authentication attempts." />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} placeholder="Search by email or IP…" className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none" />
        </div>
        <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
          <option value="">All</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <DataTable<LoginRow>
        loading={loading}
        rows={rows}
        pagination={{ page: meta.page, lastPage: meta.lastPage, total: meta.total, onPageChange: setPage }}
        empty={<EmptyState icon={Activity} title="No login activity yet" />}
        columns={[
          { key: "email", label: "Email", render: (r) => <span className="font-medium text-gray-900">{r.email}</span> },
          { key: "user", label: "User", render: (r) => r.user?.name || "—" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
          { key: "ip_address", label: "IP", render: (r) => <span className="font-mono text-xs text-gray-500">{r.ip_address}</span> },
          { key: "created_at", label: "When", render: (r) => new Date(r.created_at).toLocaleString() },
        ]}
      />
    </div>
  );
}
