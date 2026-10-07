"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Send, Copy, ExternalLink, Search } from "lucide-react";
import { api } from "@/lib/admin/api";
import { useAdminAuth } from "@/components/admin/auth-provider";
import { useToast } from "@/components/admin/toast";
import { PageHeader, StatusBadge, ConfirmDialog } from "@/components/admin/ui";
import { DataTable } from "@/components/admin/data-table";

export default function PagesPage() {
  const { can } = useAdminAuth();
  const toast = useToast();
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page: 1, lastPage: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), per_page: "15" });
      if (search) params.set("search", search);
      if (status) params.set("status", status);
      const res = await api.get(`/admin/pages?${params.toString()}`);
      setRows(res.data.data || []);
      setMeta({ page: res.data.current_page, lastPage: res.data.last_page, total: res.data.total });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, status, toast]);

  useEffect(() => {
    const t = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const publish = async (row) => {
    try {
      await api.post(`/admin/pages/${row.id}/publish`);
      toast.success("Page status updated");
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const duplicate = async (row) => {
    try {
      await api.post(`/admin/pages/${row.id}/duplicate`);
      toast.success("Page duplicated");
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const doDelete = async () => {
    setDeleting(true);
    try {
      await api.del(`/admin/pages/${confirm.id}`);
      toast.success("Page deleted");
      setConfirm(null);
      load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Pages"
        description="Create and manage website pages with the block builder."
        actions={
          can("pages.create") && (
            <button
              onClick={() => router.push("/admin/pages/new")}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" /> New page
            </button>
          )
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search pages…"
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>

      <DataTable
        loading={loading}
        rows={rows}
        pagination={{ page: meta.page, lastPage: meta.lastPage, total: meta.total, onPageChange: setPage }}
        onRowClick={(row) => router.push(`/admin/pages/${row.id}`)}
        columns={[
          {
            key: "title",
            label: "Title",
            render: (r) => (
              <div>
                <p className="font-medium text-gray-900">{r.title}</p>
                <p className="font-mono text-xs text-gray-400">/{r.slug}</p>
              </div>
            ),
          },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
          { key: "sections_count", label: "Blocks", render: (r) => r.sections_count ?? 0 },
          { key: "updated_at", label: "Updated", render: (r) => new Date(r.updated_at).toLocaleDateString() },
          {
            key: "__actions",
            label: "",
            className: "text-right whitespace-nowrap",
            render: (r) => (
              <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                <a
                  href={`/${r.slug === "home" ? "" : r.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  title="View"
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                {can("pages.publish") && (
                  <button onClick={() => publish(r)} title="Publish / Unpublish" className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-emerald-600">
                    <Send className="h-4 w-4" />
                  </button>
                )}
                {can("pages.create") && (
                  <button onClick={() => duplicate(r)} title="Duplicate" className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600">
                    <Copy className="h-4 w-4" />
                  </button>
                )}
                {can("pages.update") && (
                  <button onClick={() => router.push(`/admin/pages/${r.id}`)} title="Edit" className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600">
                    <Pencil className="h-4 w-4" />
                  </button>
                )}
                {can("pages.delete") && !r.is_system && (
                  <button onClick={() => setConfirm(r)} title="Delete" className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ),
          },
        ]}
      />

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={doDelete}
        loading={deleting}
        title="Delete page"
        description={`Delete "${confirm?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
