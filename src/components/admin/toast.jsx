"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, type = "success", duration = 4000) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss],
  );

  const toast = {
    success: (m, d) => push(m, "success", d),
    error: (m, d) => push(m, "error", d ?? 6000),
    info: (m, d) => push(m, "info", d),
    warning: (m, d) => push(m, "warning", d),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }) {
  const styles = {
    success: "border-emerald-200 bg-white text-emerald-700",
    error: "border-red-200 bg-white text-red-700",
    warning: "border-amber-200 bg-white text-amber-700",
    info: "border-blue-200 bg-white text-blue-700",
  };
  const icons = {
    success: CheckCircle2,
    error: AlertTriangle,
    warning: AlertTriangle,
    info: Info,
  };
  const Icon = icons[toast.type] || Info;

  return (
    <div
      role="status"
      className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-3 shadow-lg animate-in slide-in-from-bottom-2 ${styles[toast.type]}`}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={onDismiss}
        className="text-gray-400 transition hover:text-gray-600"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
