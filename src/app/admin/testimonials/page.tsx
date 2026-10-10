"use client";

import { ResourceManager } from "@/components/admin/resource-manager";
import { StatusBadge } from "@/components/admin/ui";
import type { Testimonial } from "@/types";

export default function TestimonialsPage() {
  return (
    <ResourceManager<Testimonial>
      title="Testimonial"
      description="Client testimonials displayed across the site."
      endpoint="/admin/testimonials"
      permissions={{ create: "content.create", update: "content.update", delete: "content.delete" }}
      togglable
      columns={[
        { key: "name", label: "Name", render: (r) => <span className="font-medium text-gray-900">{r.name}</span> },
        { key: "role", label: "Role" },
        { key: "rating", label: "Rating", render: (r) => "★".repeat(r.rating || 0) },
        { key: "is_active", label: "Status", render: (r) => <StatusBadge status={r.is_active ? "active" : "inactive"} /> },
      ]}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "role", label: "Role", type: "text" },
        { name: "content", label: "Content", type: "textarea", wide: true, required: true },
        { name: "rating", label: "Rating (1-5)", type: "number" },
        { name: "avatar_media_id", label: "Avatar", type: "image" },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "is_active", label: "Active", type: "boolean" },
      ]}
      defaultValues={{ rating: 5, is_active: true, sort_order: 0 }}
    />
  );
}
