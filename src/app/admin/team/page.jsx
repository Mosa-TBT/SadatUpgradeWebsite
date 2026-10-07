"use client";

import { ResourceManager } from "@/components/admin/resource-manager";
import { StatusBadge } from "@/components/admin/ui";

const SOCIAL_FIELDS = [
  { name: "social_facebook", label: "Facebook URL", type: "url", placeholder: "https://facebook.com/…" },
  { name: "social_instagram", label: "Instagram URL", type: "url", placeholder: "https://instagram.com/…" },
  { name: "social_linkedin", label: "LinkedIn URL", type: "url", placeholder: "https://linkedin.com/in/…" },
  { name: "social_x", label: "X / Twitter URL", type: "url", placeholder: "https://x.com/…" },
  { name: "social_github", label: "GitHub URL", type: "url", placeholder: "https://github.com/…" },
];

export default function TeamPage() {
  return (
    <ResourceManager
      title="Team Member"
      description="Team members are shown on the website's Team section, managed entirely from here."
      endpoint="/admin/team"
      permissions={{ create: "content.create", update: "content.update", delete: "content.delete" }}
      searchable
      togglable
      modalSize="lg"
      columns={[
        {
          key: "name",
          label: "Member",
          render: (r) => (
            <div className="flex items-center gap-3">
              {r.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.image_url}
                  alt={r.name}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-500">
                  {r.name?.slice(0, 1)?.toUpperCase()}
                </span>
              )}
              <span className="font-medium text-gray-900">{r.name}</span>
            </div>
          ),
        },
        { key: "role", label: "Position" },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        { key: "sort_order", label: "Order" },
        {
          key: "portfolio_url",
          label: "Portfolio",
          render: (r) =>
            r.portfolio_url ? (
              <span className="text-xs font-medium text-blue-600">Linked</span>
            ) : (
              <span className="text-xs text-gray-400">—</span>
            ),
        },
      ]}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "role", label: "Position", type: "text", required: true, hint: "e.g. CEO, Developer, Designer" },
        { name: "department", label: "Department", type: "text" },
        { name: "image_media_id", label: "Photo", type: "image" },
        {
          name: "portfolio_url",
          label: "Portfolio URL (Optional)",
          type: "url",
          hint: "Leave empty if the member has no portfolio. The card only becomes clickable when a URL is provided.",
          placeholder: "https://example.com/your-name",
        },
        ...SOCIAL_FIELDS.map((f) => ({ ...f, wide: false })),
        { name: "bio", label: "Bio", type: "textarea", wide: true },
        { name: "status", label: "Active / Published", type: "select", options: { active: "Active", inactive: "Inactive" } },
        { name: "sort_order", label: "Display order", type: "number", hint: "Lower numbers appear first" },
      ]}
      defaultValues={{ status: "active", sort_order: 0, social_facebook: "", social_instagram: "", social_linkedin: "", social_x: "", social_github: "", portfolio_url: "" }}
      transformForEdit={(row) => ({
        ...row,
        portfolio_url: row.portfolio_url || "",
        social_facebook: row.socials?.facebook || row.socials?.["facebook"] || "",
        social_instagram: row.socials?.instagram || "",
        social_linkedin: row.socials?.linkedin || "",
        social_x: row.socials?.x || row.socials?.twitter || "",
        social_github: row.socials?.github || "",
      })}
      transformForSave={(values) => {
        const socials = {};
        if (values.social_facebook) socials.facebook = values.social_facebook;
        if (values.social_instagram) socials.instagram = values.social_instagram;
        if (values.social_linkedin) socials.linkedin = values.social_linkedin;
        if (values.social_x) socials.x = values.social_x;
        if (values.social_github) socials.github = values.social_github;
        return {
          ...values,
          socials,
          social_facebook: undefined,
          social_instagram: undefined,
          social_linkedin: undefined,
          social_x: undefined,
          social_github: undefined,
        };
      }}
    />
  );
}