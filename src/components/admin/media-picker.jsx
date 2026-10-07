"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ImageIcon, Search, Upload, X, Check } from "lucide-react";
import { api, API_URL } from "@/lib/admin/api";
import { Modal, Spinner, EmptyState } from "@/components/admin/ui";
import { useToast } from "@/components/admin/toast";

export function MediaPicker({ open, onClose, onSelect, accept = "image", multiple = false }) {
  const toast = useToast();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/admin/media?type=${accept === "document" ? "document" : "image"}&per_page=48&search=${encodeURIComponent(search)}`,
      );
      setMedia(res.data.data || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [accept, search, toast]);

  useEffect(() => {
    if (open) {
      setSelected([]);
      load();
    }
  }, [open, load]);

  const upload = async (files) => {
    if (!files?.length) return;
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("files[]", f));
    setUploading(true);
    try {
      await api.upload("/admin/media", formData);
      toast.success("Upload complete");
      load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  const toggle = (item) => {
    if (multiple) {
      setSelected((prev) =>
        prev.some((s) => s.id === item.id)
          ? prev.filter((s) => s.id !== item.id)
          : [...prev, item],
      );
    } else {
      setSelected([item]);
    }
  };

  const confirm = () => {
    if (!selected.length) return;
    onSelect(multiple ? selected : selected[0]);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Media Library"
      size="lg"
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            disabled={!selected.length}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {multiple ? `Select ${selected.length || ""}`.trim() : "Select"}
          </button>
        </>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder="Search media…"
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => upload(e.target.files)}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          {uploading ? <Spinner className="text-white" /> : <Upload className="h-4 w-4" />}
          Upload
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : media.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No media found"
          description="Upload images to get started."
        />
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {media.map((item) => {
            const isSelected = selected.some((s) => s.id === item.id);
            const isImage = (item.mime_type || "").startsWith("image/");
            return (
              <button
                key={item.id}
                onClick={() => toggle(item)}
                className={`group relative aspect-square overflow-hidden rounded-lg border-2 bg-gray-100 ${
                  isSelected ? "border-blue-500" : "border-transparent hover:border-gray-300"
                }`}
              >
                {isImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.thumbnail_url || item.url}
                    alt={item.alt || item.original_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-xs text-gray-500">
                    {item.extension?.toUpperCase()}
                  </span>
                )}
                {isSelected && (
                  <span className="absolute right-1 top-1 rounded-full bg-blue-600 p-1 text-white">
                    <Check className="h-3 w-3" />
                  </span>
                )}
                <span className="absolute inset-x-0 bottom-0 truncate bg-black/60 px-1.5 py-1 text-left text-[10px] text-white opacity-0 transition group-hover:opacity-100">
                  {item.original_name}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </Modal>
  );
}

export function ImageField({ value, onChange, valueKey = "id", label, hint }) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }
    if (valueKey === "url" && typeof value === "string") {
      setPreview(value);
    } else {
      api
        .get(`/admin/media/${value}`)
        .then((res) => setPreview(res.data.url))
        .catch(() => setPreview(null));
    }
  }, [value, valueKey]);

  return (
    <div>
      {label && <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>}
      <div className="flex items-center gap-3">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-6 w-6 text-gray-300" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Select
            </button>
            {value ? (
              <button
                type="button"
                onClick={() => onChange(null)}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <X className="h-3.5 w-3.5" /> Remove
              </button>
            ) : null}
          </div>
          {hint && <p className="text-xs text-gray-400">{hint}</p>}
        </div>
      </div>
      <MediaPicker
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(item) => onChange(valueKey === "url" ? item.url : item.id)}
      />
    </div>
  );
}

export { API_URL };
