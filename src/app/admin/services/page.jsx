"use client";

import { ResourceManager } from "@/components/admin/resource-manager";
import { StatusBadge } from "@/components/admin/ui";

export default function ServicesPage() {
  return (
    <ResourceManager
      title="Service"
      description="Services shown on the website services section."
      endpoint="/admin/services"
      permissions={{ create: "content.create", update: "content.update", delete: "content.delete" }}
      searchable
      togglable
      columns={[
        { key: "title", label: "Title", render: (r) => <span className="font-medium text-gray-900">{r.title}</span> },
        { key: "slug", label: "Slug", render: (r) => <span className="font-mono text-xs text-gray-500">/{r.slug}</span> },
        { key: "features", label: "Features", render: (r) => `${(r.features || []).length} items` },
        { key: "is_active", label: "Status", render: (r) => <StatusBadge status={r.is_active ? "active" : "inactive"} /> },
      ]}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", hint: "Leave blank to auto-generate" },
        { name: "icon", label: "Icon (lucide name)", type: "text" },
        { name: "short_description", label: "Short description", type: "textarea", wide: true },
        { name: "description", label: "Full description", type: "richtext", wide: true },
        { name: "features", label: "Features", type: "tags", wide: true },
        { name: "technologies", label: "Technologies", type: "tags", wide: true },
        { name: "image_media_id", label: "Image", type: "image" },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "is_active", label: "Active", type: "boolean" },
      ]}
      defaultValues={{ is_active: true, sort_order: 0, features: [], technologies: [] }}
    />
  );
}
