"use client";

import { ResourceManager } from "@/components/admin/resource-manager";
import { StatusBadge } from "@/components/admin/ui";

export default function LanguagesPage() {
  return (
    <ResourceManager
      title="Language"
      description="Manage available languages. RTL is supported automatically."
      endpoint="/admin/languages"
      permissions={{ create: "localization.update", update: "localization.update", delete: "localization.update" }}
      searchable={false}
      columns={[
        { key: "name", label: "Language", render: (r) => (
          <div>
            <p className="font-medium text-gray-900">{r.name} <span className="text-gray-400">({r.native_name})</span></p>
            <p className="font-mono text-xs text-gray-400">{r.code}</p>
          </div>
        ) },
        { key: "direction", label: "Direction", render: (r) => r.direction.toUpperCase() },
        { key: "is_default", label: "Default", render: (r) => (r.is_default ? "Yes" : "—") },
        { key: "translations_count", label: "Strings", render: (r) => r.translations_count ?? 0 },
        { key: "is_active", label: "Status", render: (r) => <StatusBadge status={r.is_active ? "active" : "inactive"} /> },
      ]}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "native_name", label: "Native name", type: "text", required: true },
        { name: "code", label: "Code (e.g. en)", type: "text", required: true },
        { name: "direction", label: "Direction", type: "select", options: { ltr: "LTR", rtl: "RTL" } },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "is_active", label: "Active", type: "boolean" },
        { name: "is_default", label: "Default language", type: "boolean" },
      ]}
      defaultValues={{ direction: "ltr", is_active: true, is_default: false, sort_order: 0 }}
    />
  );
}
