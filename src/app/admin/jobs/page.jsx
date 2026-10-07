"use client";

import { ResourceManager } from "@/components/admin/resource-manager";
import { StatusBadge } from "@/components/admin/ui";

export default function JobsPage() {
  return (
    <ResourceManager
      title="Job Opening"
      description="Open positions listed on the careers page."
      endpoint="/admin/jobs"
      permissions={{ create: "content.create", update: "content.update", delete: "content.delete" }}
      searchable
      columns={[
        { key: "title", label: "Title", render: (r) => <span className="font-medium text-gray-900">{r.title}</span> },
        { key: "department", label: "Department" },
        { key: "location", label: "Location" },
        { key: "type", label: "Type" },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
      ]}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text" },
        { name: "department", label: "Department", type: "text" },
        { name: "location", label: "Location", type: "text" },
        { name: "type", label: "Type", type: "text" },
        { name: "salary", label: "Salary", type: "text" },
        { name: "description", label: "Description", type: "richtext", wide: true },
        { name: "requirements", label: "Requirements", type: "tags", wide: true },
        { name: "status", label: "Status", type: "select", options: { open: "Open", closed: "Closed" } },
        { name: "posted_at", label: "Posted at", type: "text", hint: "YYYY-MM-DD" },
        { name: "sort_order", label: "Sort order", type: "number" },
      ]}
      defaultValues={{ status: "open", type: "Full-time", sort_order: 0, requirements: [] }}
    />
  );
}
