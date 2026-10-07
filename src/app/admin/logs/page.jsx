"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Eye } from "lucide-react";
import { api } from "@/lib/admin/api";
import { useToast } from "@/components/admin/toast";
import { PageHeader, Modal, EmptyState } from "@/components/admin/ui";
import { DataTable } from "@/components/admin/data-table";

export default function LogsPage() {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page: 1, lastPage: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ search: "", event: "", from: "", to: "" });
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), per_page: "20" });
      Object.entries(filters).forEach(([k, v]) => v && params.set(k, v));
      const res = await api.get(`/admin/audit-logs?${params.toString()}`);
      setRows(res.data.data || []);
      setMeta({ page: res.data.current_page, lastPage: res.data.last_page, total: res.data.total });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, filters, toast]);

  useEffect(() => {
    const t = setTimeout(load, filters.search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, filters.search]);

  useEffect(() => {
    api.get("/admin/audit-logs/events").then((res) => setEvents(res.data || [])).catch(() => {});
  }, []);

  return (
    <div>
      <PageHeader title="Activity Log" description="A searchable record of administrative actions." />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={filters.search}
            onChange={(e) => { setPage(1); setFilters((f) => ({ ...f, search: e.target.value })); }}
            placeholder="Search logs…"
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <select value={filters.event} onChange={(e) => { setPage(1); setFilters((f) => ({ ...f, event: e.target.value })); }} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
          <option value="">All events</option>
          {events.map((ev) => <option key={ev} value={ev}>{ev}</option>)}
        </select>
        <input type="date" value={filters.from} onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
        <input type="date" value={filters.to} onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
      </div>

      <DataTable
        loading={loading}
        rows={rows}
        pagination={{ page: meta.page, lastPage: meta.lastPage, total: meta.total, onPageChange: setPage }}
        onRowClick={setViewing}
        empty={<EmptyState title="No activity recorded" />}
        columns={[
          { key: "event", label: "Event", render: (r) => <span className="font-mono text-xs text-gray-700">{r.event}</span> },
          { key: "user", label: "User", render: (r) => r.user?.name || "System" },
          { key: "ip_address", label: "IP", render: (r) => <span className="font-mono text-xs text-gray-500">{r.ip_address || "—"}</span> },
          { key: "created_at", label: "When", render: (r) => new Date(r.created_at).toLocaleString() },
          {
            key: "__actions",
            label: "",
            className: "text-right",
            render: (r) => (
              <button onClick={(e) => { e.stopPropagation(); setViewing(r); }} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600">
                <Eye className="h-4 w-4" />
              </button>
            ),
          },
        ]}
      />

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Activity detail" size="md">
        {viewing && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Event" value={viewing.event} mono />
              <Field label="User" value={viewing.user?.name || "System"} />
              <Field label="IP address" value={viewing.ip_address || "—"} mono />
              <Field label="Method" value={viewing.method || "—"} />
              <Field label="URL" value={viewing.url || "—"} span />
              <Field label="Time" value={new Date(viewing.created_at).toLocaleString()} />
            </div>
            {viewing.description && <Field label="Description" value={viewing.description} span />}
            <div className="grid gap-3 sm:grid-cols-2">
              <JsonBlock label="Old values" data={viewing.old_values} />
              <JsonBlock label="New values" data={viewing.new_values} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Field({ label, value, mono, span }) {
  return (
    <div className={span ? "sm:col-span-2" : ""}>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className={"break-all text-gray-800 " + (mono ? "font-mono text-xs" : "")}>{value}</p>
    </div>
  );
}

function JsonBlock({ label, data }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <pre className="max-h-48 overflow-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-700">
        {data ? JSON.stringify(data, null, 2) : "—"}
      </pre>
    </div>
  );
}
