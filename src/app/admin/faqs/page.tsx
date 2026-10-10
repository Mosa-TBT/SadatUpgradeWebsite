"use client";

import { ResourceManager } from "@/components/admin/resource-manager";
import { StatusBadge } from "@/components/admin/ui";
import type { Faq } from "@/types";

export default function FaqsPage() {
  return (
    <ResourceManager<Faq>
      title="FAQ"
      description="Frequently asked questions used on the site."
      endpoint="/admin/faqs"
      permissions={{ create: "content.create", update: "content.update", delete: "content.delete" }}
      togglable
      columns={[
        { key: "question", label: "Question", render: (r) => <span className="font-medium text-gray-900">{r.question}</span> },
        { key: "category", label: "Category" },
        { key: "is_active", label: "Status", render: (r) => <StatusBadge status={r.is_active ? "active" : "inactive"} /> },
      ]}
      fields={[
        { name: "question", label: "Question", type: "text", wide: true, required: true },
        { name: "answer", label: "Answer", type: "textarea", wide: true, required: true },
        { name: "category", label: "Category", type: "text" },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "is_active", label: "Active", type: "boolean" },
      ]}
      defaultValues={{ is_active: true, sort_order: 0, category: "general" }}
    />
  );
}
