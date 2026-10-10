"use client";

import { ResourceManager } from "@/components/admin/resource-manager";
import { StatusBadge } from "@/components/admin/ui";
import type { Project } from "@/types";

export default function ProjectsPage() {
  return (
    <ResourceManager<Project>
      title="Project"
      description="Portfolio projects displayed on the website."
      endpoint="/admin/projects"
      permissions={{ create: "content.create", update: "content.update", delete: "content.delete" }}
      searchable
      togglable
      filters={[
        { name: "category", label: "All categories", options: [
          { value: "Web Development", label: "Web Development" },
          { value: "Mobile App", label: "Mobile App" },
          { value: "UI/UX Design", label: "UI/UX Design" },
          { value: "Branding", label: "Branding" },
        ] },
      ]}
      modalSize="lg"
      columns={[
        { key: "title", label: "Title", render: (r) => <span className="font-medium text-gray-900">{r.title}</span> },
        { key: "category", label: "Category" },
        { key: "client_name", label: "Client" },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
      ]}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text" },
        { name: "category", label: "Category", type: "text" },
        { name: "client_name", label: "Client name", type: "text" },
        { name: "short_description", label: "Short description", type: "textarea", wide: true },
        { name: "description", label: "Full description", type: "richtext", wide: true },
        { name: "duration", label: "Duration", type: "text" },
        { name: "team_size", label: "Team size", type: "number" },
        { name: "image_media_id", label: "Featured image", type: "image" },
        { name: "technologies", label: "Technologies", type: "tags", wide: true },
        { name: "results", label: "Results", type: "tags", wide: true },
        { name: "challenges", label: "Challenges", type: "tags", wide: true },
        { name: "solutions", label: "Solutions", type: "tags", wide: true },
        { name: "testimonial_content", label: "Testimonial", type: "textarea", wide: true },
        { name: "testimonial_author", label: "Testimonial author", type: "text" },
        { name: "testimonial_role", label: "Testimonial role", type: "text" },
        { name: "live_url", label: "Live URL", type: "url" },
        { name: "repo_url", label: "Repository URL", type: "url" },
        { name: "status", label: "Status", type: "select", options: { draft: "Draft", published: "Published" } },
        { name: "is_featured", label: "Featured", type: "boolean" },
        { name: "is_active", label: "Active", type: "boolean" },
        { name: "sort_order", label: "Sort order", type: "number" },
      ]}
      defaultValues={{ status: "published", is_active: true, is_featured: false, sort_order: 0 }}
    />
  );
}
