"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Trash2, Plus, Mail, UserCheck, UserX } from "lucide-react";
import { api } from "@/lib/admin/api";
import { useAdminAuth } from "@/components/admin/auth-provider";
import { useToast } from "@/components/admin/toast";
import { PageHeader, StatusBadge, Modal, ConfirmDialog, EmptyState } from "@/components/admin/ui";
import { DataTable } from "@/components/admin/data-table";

export default function NewsletterPage() {
  const { can } = useAdminAuth();
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page: 1, lastPage: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), per_page: "15" });
      if (search) params.set("search", search);
      const res = await api.get(`/admin/newsletter?${params.toString()}`);
      setRows(res.data.data || []);
      setMeta({ page: res.data.current_page, lastPage: res.data.last_page, total: res.data.total });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, toast]);

  useEffect(() => {
    const t = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const add = async () => {
    try {
      await api.post("/admin/newsletter", { email, source: "admin" });
      toast.success("Subscriber added");
      setAddOpen(false);
      setEmail("");
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const toggle = async (row) => {
    try {
      await api.put(`/admin/newsletter/${row.id}`, { status: row.status === "subscribed" ? "unsubscribed" : "subscribed" });
      toast.success("Subscriber updated");
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const doDelete = async () => {
    setDeleting(true);
    try {
      await api.del(`/admin/newsletter/${confirm.id}`);
      toast.success("Subscriber removed");
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
        title="Newsletter"
        description="Manage newsletter subscribers."
        actions={
          can("messages.update") && (
            <button onClick={() => setAddOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              <Plus className="h-4 w-4" /> Add subscriber
            </button>
          )
        }
      />

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            placeholder="Search by email…"
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <DataTable
        loading={loading}
        rows={rows}
        pagination={{ page: meta.page, lastPage: meta.lastPage, total: meta.total, onPageChange: setPage }}
        empty={<EmptyState icon={Mail} title="No subscribers yet" />}
        columns={[
          { key: "email", label: "Email", render: (r) => <span className="font-medium text-gray-900">{r.email}</span> },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
          { key: "source", label: "Source", render: (r) => r.source || "—" },
          { key: "created_at", label: "Added", render: (r) => new Date(r.created_at).toLocaleDateString() },
          {
            key: "__actions",
            label: "",
            className: "text-right",
            render: (r) => (
              <div className="flex justify-end gap-1">
                {can("messages.update") && (
                  <button onClick={() => toggle(r)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600">
                    {r.status === "subscribed" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                  </button>
                )}
                {can("messages.delete") && (
                  <button onClick={() => setConfirm(r)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ),
          },
        ]}
      />

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add subscriber"
        size="sm"
        footer={
          <>
            <button onClick={() => setAddOpen(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={add} disabled={!email} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">Add</button>
          </>
        }
      >
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={doDelete}
        loading={deleting}
        title="Remove subscriber"
        description={`Remove ${confirm?.email}?`}
        confirmLabel="Remove"
      />
    </div>
  );
}
