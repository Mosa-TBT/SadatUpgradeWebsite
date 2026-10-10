"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { ResourceManager } from "@/components/admin/resource-manager";
import { StatusBadge, Spinner } from "@/components/admin/ui";
import { api } from "@/lib/admin/api";
import { useToast } from "@/components/admin/toast";
import type { FieldValue } from "@/components/admin/form-fields";
import type { ApiEnvelope, Category, Paginated, Post, Tag } from "@/types";

interface PostRow extends Post {
  category_id?: number | null;
}

export default function PostsPage() {
  const toast = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<ApiEnvelope<Paginated<Category> | Category[]>>("/admin/post-categories?all=1")
      .then((res) => {
        const payload = res.data;
        setCategories(Array.isArray(payload) ? payload : payload.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="h-7 w-7" />
      </div>
    );
  }

  const categoryOptions = Object.fromEntries(categories.map((c) => [String(c.id), c.name]));

  return (
    <ResourceManager<PostRow>
      title="Post"
      description="Blog articles displayed on the website."
      endpoint="/admin/posts"
      permissions={{ create: "posts.create", update: "posts.update", delete: "posts.delete" }}
      searchable
      modalSize="lg"
      filters={[{ name: "status", label: "All statuses", options: [
        { value: "published", label: "Published" },
        { value: "draft", label: "Draft" },
        { value: "scheduled", label: "Scheduled" },
      ] }]}
      columns={[
        { key: "title", label: "Title", render: (r) => <span className="font-medium text-gray-900">{r.title}</span> },
        { key: "category", label: "Category", render: (r) => r.category?.name || "—" },
        { key: "author", label: "Author", render: (r) => r.author?.name || "—" },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
      ]}
      extraRowActions={(row, reload) => (
        <button
          onClick={async () => {
            try {
              await api.post(`/admin/posts/${row.id}/publish`);
              toast.success("Post status updated");
              reload();
            } catch (e) {
              toast.error(e instanceof Error ? e.message : String(e));
            }
          }}
          title={row.status === "published" ? "Unpublish" : "Publish"}
          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-emerald-600"
        >
          <Send className="h-4 w-4" />
        </button>
      )}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text" },
        { name: "excerpt", label: "Excerpt", type: "textarea", wide: true },
        { name: "content", label: "Content", type: "richtext", wide: true },
        { name: "featured_media_id", label: "Featured image", type: "image" },
        { name: "category_id", label: "Category", type: "select", options: categoryOptions },
        { name: "status", label: "Status", type: "select", options: { draft: "Draft", published: "Published", scheduled: "Scheduled" } },
        { name: "published_at", label: "Publish date", type: "text", hint: "YYYY-MM-DD HH:MM" },
        { name: "read_time", label: "Read time (min)", type: "number" },
        { name: "is_featured", label: "Featured", type: "boolean" },
        { name: "tags", label: "Tags", type: "tags", wide: true },
        { name: "seo_title", label: "SEO title", type: "text", wide: true },
        { name: "seo_description", label: "SEO description", type: "textarea", wide: true },
      ]}
      defaultValues={{ status: "draft", is_featured: false, tags: [], robots_index: true, robots_follow: true }}
      transformForEdit={(row) =>
        ({
          ...row,
          category_id: row.category_id ? String(row.category_id) : "",
          tags: (row.tags || []).map((t) => (typeof t === "string" ? t : (t as Tag).name)),
        }) as unknown as Record<string, FieldValue>
      }
      transformForSave={(values) => ({
        ...values,
        category_id: values.category_id ? Number(values.category_id) : null,
      })}
    />
  );
}
