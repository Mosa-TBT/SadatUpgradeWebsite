"use client";

import { useEffect, useState } from "react";
import { X, Loader2, Inbox, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, actions, children }) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        {children}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SectionCard({ title, description, actions, children, className }) {
  return (
    <div className={cn("rounded-xl border border-gray-200 bg-white shadow-sm", className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            {title && <h2 className="text-base font-semibold text-gray-900">{title}</h2>}
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

export function StatCard({ label, value, hint, icon: Icon, trend, accent = "blue" }) {
  const accents = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    gray: "bg-gray-100 text-gray-600",
  };
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
        </div>
        {Icon && (
          <span className={cn("rounded-lg p-2.5", accents[accent])}>
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
      {trend != null && (
        <p className={cn("mt-3 text-xs font-medium", trend >= 0 ? "text-emerald-600" : "text-red-600")}>
          {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
        </p>
      )}
    </div>
  );
}

export function EmptyState({ title = "Nothing here yet", description, icon: Icon = Inbox, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50/60 px-6 py-14 text-center">
      <span className="mb-3 rounded-full bg-white p-3 text-gray-400 shadow-sm">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-md bg-gray-200", className)} />;
}

export function TableSkeleton({ rows = 6, cols = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-6" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function Spinner({ className }) {
  return <Loader2 className={cn("h-5 w-5 animate-spin text-blue-600", className)} />;
}

export function Modal({ open, onClose, title, children, footer, size = "md" }) {
  useEffect(() => {
    if (!open) return undefined;
    const handler = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-gray-900/50 p-4 sm:p-6">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-10 my-4 w-full rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95",
          sizes[size],
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  requireText,
  loading,
  destructive = true,
}) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) setValue("");
  }, [open]);

  const blocked = requireText ? value !== requireText : false;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading || blocked}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60",
              destructive ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700",
            )}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex gap-3">
        <span
          className={cn(
            "h-fit rounded-full p-2",
            destructive ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600",
          )}
        >
          <AlertTriangle className="h-5 w-5" />
        </span>
        <div className="flex-1 space-y-3">
          <p className="text-sm text-gray-600">{description}</p>
          {requireText && (
            <div>
              <label className="text-xs font-medium text-gray-500">
                Type{" "}
                <span className="font-mono font-semibold text-gray-800">{requireText}</span>{" "}
                to confirm
              </label>
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export function StatusBadge({ status }) {
  const map = {
    published: "bg-emerald-50 text-emerald-700 border-emerald-200",
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    open: "bg-emerald-50 text-emerald-700 border-emerald-200",
    draft: "bg-gray-100 text-gray-600 border-gray-200",
    inactive: "bg-gray-100 text-gray-600 border-gray-200",
    closed: "bg-gray-100 text-gray-600 border-gray-200",
    scheduled: "bg-blue-50 text-blue-700 border-blue-200",
    new: "bg-blue-50 text-blue-700 border-blue-200",
    read: "bg-gray-100 text-gray-600 border-gray-200",
    replied: "bg-emerald-50 text-emerald-700 border-emerald-200",
    archived: "bg-amber-50 text-amber-700 border-amber-200",
    suspended: "bg-red-50 text-red-700 border-red-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    failed: "bg-red-50 text-red-700 border-red-200",
    blocked: "bg-amber-50 text-amber-700 border-amber-200",
  };
  const cls = map[status] || "bg-gray-100 text-gray-600 border-gray-200";
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", cls)}>
      {status}
    </span>
  );
}
