"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, Search, Copy, Trash2, Pencil, FileText, ImageIcon, Check } from "lucide-react";
import { api } from "@/lib/admin/api";
import { useAdminAuth } from "@/components/admin/auth-provider";
import { useToast } from "@/components/admin/toast";
import { PageHeader, Modal, ConfirmDialog, Spinner, EmptyState, Skeleton } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import type { ApiEnvelope, Media, Paginated } from "@/types";

interface MediaForm {
  alt: string;
  title: string;
  folder: string;
}

interface PaginationMeta {
  page: number;
  lastPage: number;
  total: number;
}

export default function MediaPage() {
  const { can } = useAdminAuth();
  const toast = useToast();
  const [items, setItems] = useState<Media[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, lastPage: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<Media | null>(null);
  const [form, setForm] = useState<MediaForm>({ alt: "", title: "", folder: "" });
  const [confirm, setConfirm] = useState<Media | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), per_page: "24" });
      if (search) params.set("search", search);
      if (type) params.set("type", type);
      const res = await api.get<ApiEnvelope<Paginated<Media>>>(`/admin/media?${params.toString()}`);
      setItems(res.data.data || []);
      setMeta({
        page: res.data.current_page,
        lastPage: res.data.last_page,
        total: res.data.total,
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [page, search, type, toast]);

  useEffect(() => {
    const t = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files[]", f));
    setUploading(true);
    try {
      await api.upload("/admin/media", fd);
      toast.success("Upload complete");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = async (item: Media) => {
    try {
      await navigator.clipboard.writeText(item.url);
      toast.success("URL copied");
    } catch {
      toast.error("Could not copy");
    }
  };

  const saveEdit = async () => {
    try {
      await api.put(`/admin/media/${editing?.id}`, form);
      toast.success("Media updated");
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  };

  const deleteOne = async () => {
    setDeleting(true);
    try {
      await api.del(`/admin/media/${confirm?.id}`);
      toast.success("Media deleted");
      setConfirm(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setDeleting(false);
    }
  };

  const bulkDelete = async () => {
    if (!selected.length) return;
    setDeleting(true);
    try {
      await api.post("/admin/media/bulk-delete", { ids: selected });
      toast.success("Media deleted");
      setSelected([]);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setDeleting(false);
    }
  };

  const toggleSelect = (id: number) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div>
      <PageHeader
        title="Media Library"
        description="Upload, organize and reuse images and documents."
        actions={
          <>
            {selected.length > 0 && can("media.delete") && (
              <button
                onClick={bulkDelete}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" /> Delete {selected.length}
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.csv,.zip"
              className="hidden"
              onChange={(e) => upload(e.target.files)}
            />
            {can("media.upload") && (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {uploading ? <Spinner className="text-white" /> : <Upload className="h-4 w-4" />} Upload
              </button>
            )}
          </>
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
            placeholder="Search media…"
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <select
          value={type}
          onChange={(e) => {
            setPage(1);
            setType(e.target.value);
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">All types</option>
          <option value="image">Images</option>
          <option value="document">Documents</option>
          <option value="video">Videos</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon={ImageIcon} title="No media yet" description="Upload images and documents to build your library." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.map((item) => {
            const isImage = (item.mime_type || "").startsWith("image/");
            const isSelected = selected.includes(item.id);
            return (
              <div
                key={item.id}
                className={cn(
                  "group relative overflow-hidden rounded-xl border bg-white shadow-sm",
                  isSelected ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-200",
                )}
              >
                <button
                  onClick={() => toggleSelect(item.id)}
                  className="absolute left-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded border border-white/70 bg-white/80"
                >
                  {isSelected && <Check className="h-3.5 w-3.5 text-blue-600" />}
                </button>
                <div className="flex aspect-square items-center justify-center bg-gray-50">
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.thumbnail_url || item.url} alt={item.alt || item.original_name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-gray-400">
                      <FileText className="h-8 w-8" />
                      <span className="text-[10px] font-medium uppercase">{item.extension}</span>
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="truncate text-xs font-medium text-gray-700" title={item.original_name}>
                    {item.original_name}
                  </p>
                  <p className="text-[10px] text-gray-400">{(Math.max(0, item.size ?? 0) / 1024).toFixed(0)} KB</p>
                </div>
                <div className="absolute inset-x-0 top-0 flex justify-end gap-1 bg-gradient-to-b from-black/50 to-transparent p-1.5 opacity-0 transition group-hover:opacity-100">
                  <button onClick={() => copyUrl(item)} title="Copy URL" className="rounded p-1.5 text-white hover:bg-white/20">
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  {can("media.upload") && (
                    <button
                      onClick={() => {
                        setEditing(item);
                        setForm({ alt: item.alt || "", title: item.title || "", folder: item.folder || "" });
                      }}
                      title="Edit"
                      className="rounded p-1.5 text-white hover:bg-white/20"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {can("media.delete") && (
                    <button onClick={() => setConfirm(item)} title="Delete" className="rounded p-1.5 text-white hover:bg-red-500/80">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {meta.lastPage > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3 text-sm text-gray-500">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={meta.page <= 1}
            className="rounded-lg border border-gray-300 px-3 py-1.5 disabled:opacity-40"
          >
            Prev
          </button>
          <span>Page {meta.page} of {meta.lastPage} · {meta.total} files</span>
          <button
            onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
            disabled={meta.page >= meta.lastPage}
            className="rounded-lg border border-gray-300 px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Media details"
        size="sm"
        footer={
          <>
            <button onClick={() => setEditing(null)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={saveEdit} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Save
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          <input value={form.alt} onChange={(e) => setForm((p) => ({ ...p, alt: e.target.value }))} placeholder="Alt text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          <input value={form.folder} onChange={(e) => setForm((p) => ({ ...p, folder: e.target.value }))} placeholder="Folder" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={deleteOne}
        loading={deleting}
        title="Delete media"
        description={`Permanently delete "${confirm?.original_name}"?`}
        confirmLabel="Delete"
      />
    </div>
  );
}
