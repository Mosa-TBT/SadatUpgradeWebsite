"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Search, Trash2, Eye, Mail } from "lucide-react";
import { api } from "@/lib/admin/api";
import { useAdminAuth } from "@/components/admin/auth-provider";
import { useToast } from "@/components/admin/toast";
import { PageHeader, StatusBadge, Modal, ConfirmDialog, EmptyState } from "@/components/admin/ui";
import { DataTable } from "@/components/admin/data-table";
import type { ApiEnvelope, Paginated } from "@/types";

interface MessageRow {
  id: number;
  first_name: string;
  last_name?: string | null;
  email: string;
  phone?: string | null;
  company?: string | null;
  service?: string | null;
  budget?: string | null;
  subject?: string | null;
  message?: string | null;
  status: string;
  created_at: string;
}

interface PaginationMeta {
  page: number;
  lastPage: number;
  total: number;
}

export default function MessagesPage() {
  const { can } = useAdminAuth();
  const toast = useToast();
  const [rows, setRows] = useState<MessageRow[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, lastPage: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<MessageRow | null>(null);
  const [confirm, setConfirm] = useState<MessageRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), per_page: "15" });
      if (search) params.set("search", search);
      if (status) params.set("status", status);
      const res = await api.get<ApiEnvelope<Paginated<MessageRow>>>(`/admin/contact-messages?${params.toString()}`);
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

  const openMessage = async (row: MessageRow) => {
    try {
      const res = await api.get<ApiEnvelope<MessageRow>>(`/admin/contact-messages/${row.id}`);
      setViewing(res.data);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  };

  const updateStatus = async (value: string) => {
    if (!viewing) return;
    try {
      await api.put(`/admin/contact-messages/${viewing.id}`, { status: value });
      toast.success("Message updated");
      setViewing((prev) => (prev ? { ...prev, status: value } : prev));
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  };

  const doDelete = async () => {
    setDeleting(true);
    try {
      await api.del(`/admin/contact-messages/${confirm?.id}`);
      toast.success("Message deleted");
      setConfirm(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Contact Messages" description="Enquiries submitted from the website contact form." />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            placeholder="Search messages…"
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <DataTable<MessageRow>
        loading={loading}
        rows={rows}
        pagination={{ page: meta.page, lastPage: meta.lastPage, total: meta.total, onPageChange: setPage }}
        onRowClick={openMessage}
        empty={<EmptyState icon={Mail} title="No messages yet" />}
        columns={[
          { key: "name", label: "From", render: (r) => (
            <div>
              <p className="font-medium text-gray-900">{r.first_name} {r.last_name}</p>
              <p className="text-xs text-gray-400">{r.email}</p>
            </div>
          ) },
          { key: "subject", label: "Service", render: (r) => r.service || "—" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
          { key: "created_at", label: "Received", render: (r) => new Date(r.created_at).toLocaleString() },
          {
            key: "__actions",
            label: "",
            className: "text-right",
            render: (r) => (
              <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => openMessage(r)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600">
                  <Eye className="h-4 w-4" />
                </button>
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
        open={!!viewing}
        onClose={() => setViewing(null)}
        title="Contact message"
        size="md"
        footer={
          can("messages.update") && (
            <div className="flex gap-2">
              {["read", "replied", "archived"].map((s) => (
                <button key={s} onClick={() => updateStatus(s)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium capitalize text-gray-700 hover:bg-gray-50">
                  Mark {s}
                </button>
              ))}
            </div>
          )
        }
      >
        {viewing && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <Detail label="Name" value={`${viewing.first_name} ${viewing.last_name || ""}`} />
              <Detail label="Email" value={viewing.email} />
              <Detail label="Phone" value={viewing.phone || "—"} />
              <Detail label="Company" value={viewing.company || "—"} />
              <Detail label="Service" value={viewing.service || "—"} />
              <Detail label="Budget" value={viewing.budget || "—"} />
            </div>
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">Message</p>
              <p className="whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-gray-700">{viewing.message}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={viewing.status} />
              <span className="text-xs text-gray-400">{new Date(viewing.created_at).toLocaleString()}</span>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={doDelete}
        loading={deleting}
        title="Delete message"
        description="Permanently delete this contact message?"
        confirmLabel="Delete"
      />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-gray-800">{value}</p>
    </div>
  );
}
