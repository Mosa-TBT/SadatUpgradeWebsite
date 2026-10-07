"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  Send,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  History,
  Copy,
  LayoutTemplate,
  X,
} from "lucide-react";
import { api } from "@/lib/admin/api";
import { useToast } from "@/components/admin/toast";
import { PageHeader, SectionCard, Modal, Spinner, StatusBadge, Skeleton } from "@/components/admin/ui";
import { Field } from "@/components/admin/form-fields";

const TABS = [
  { key: "content", label: "Content" },
  { key: "sections", label: "Sections" },
  { key: "seo", label: "SEO" },
  { key: "revisions", label: "Revisions" },
];

export function PageEditor({ id }) {
  const toast = useToast();
  const router = useRouter();
  const isNew = !id || id === "new";
  const [tab, setTab] = useState("content");
  const [blocks, setBlocks] = useState({});
  const [page, setPage] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    status: "draft",
    template: "default",
    featured_media_id: null,
    published_at: "",
    is_home: false,
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    og_title: "",
    og_description: "",
    og_image: "",
    canonical_url: "",
    robots_index: true,
    robots_follow: true,
    sections: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blockPickerOpen, setBlockPickerOpen] = useState(false);
  const [revisions, setRevisions] = useState([]);
  const [expanded, setExpanded] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const blocksRes = await api.get("/admin/pages/blocks");
      setBlocks(blocksRes.data || {});

      if (!isNew) {
        const res = await api.get(`/admin/pages/${id}`);
        setPage({ ...normalize(res.data) });
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [id, isNew, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const set = (name, value) => setPage((prev) => ({ ...prev, [name]: value }));

  const save = async (extra = {}) => {
    setSaving(true);
    try {
      const payload = { ...serialize(page), ...extra };
      if (isNew) {
        const res = await api.post("/admin/pages", payload);
        toast.success("Page created");
        router.replace(`/admin/pages/${res.data.id}`);
        return res.data;
      }
      const res = await api.put(`/admin/pages/${id}`, payload);
      setPage(normalize(res.data));
      toast.success("Page saved");
      return res.data;
    } catch (e) {
      toast.error(e.message);
      throw e;
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    try {
      await save({ status: page.status === "published" ? "draft" : "published" });
      toast.success("Page status updated");
    } catch {
      /* handled */
    }
  };

  const openRevisions = async () => {
    setTab("revisions");
    try {
      const res = await api.get(`/admin/pages/${id}/revisions`);
      setRevisions(res.data || []);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const restoreRevision = async (revision) => {
    try {
      await api.post(`/admin/pages/${id}/revisions/${revision.id}/restore`);
      toast.success("Revision restored");
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const duplicate = async () => {
    try {
      const res = await api.post(`/admin/pages/${id}/duplicate`);
      toast.success("Page duplicated");
      router.push(`/admin/pages/${res.data.id}`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const deletePage = async () => {
    try {
      await api.del(`/admin/pages/${id}`);
      toast.success("Page deleted");
      router.push("/admin/pages");
    } catch (e) {
      toast.error(e.message);
    }
  };

  // Section helpers
  const addSection = (type) => {
    setPage((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        { type, name: blocks[type]?.label || type, data: {}, is_active: true, _key: `new-${Date.now()}` },
      ],
    }));
    setBlockPickerOpen(false);
    setExpanded((prev) => ({ ...prev, [`new-${Date.now()}`]: true }));
  };

  const updateSectionData = (index, field, value) => {
    setPage((prev) => ({
      ...prev,
      sections: prev.sections.map((s, i) => (i === index ? { ...s, data: { ...s.data, [field]: value } } : s)),
    }));
  };

  const removeSection = (index) =>
    setPage((prev) => ({ ...prev, sections: prev.sections.filter((_, i) => i !== index) }));

  const moveSection = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= page.sections.length) return;
    setPage((prev) => {
      const next = [...prev.sections];
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, sections: next };
    });
  };

  const toggleSectionActive = (index) =>
    setPage((prev) => ({
      ...prev,
      sections: prev.sections.map((s, i) => (i === index ? { ...s, is_active: !s.is_active } : s)),
    }));

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={isNew ? "New Page" : page.title || "Untitled"}
        description={isNew ? "Create a new page with the block builder." : `/admin/pages/${id}`}
        actions={
          <>
            {!isNew && (
              <Link
                href={`/${page.slug === "home" ? "" : page.slug}`}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <ExternalLink className="h-4 w-4" /> View
              </Link>
            )}
            {!isNew && (
              <button onClick={openRevisions} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <History className="h-4 w-4" /> Revisions
              </button>
            )}
            {!isNew && (
              <button onClick={duplicate} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Copy className="h-4 w-4" /> Duplicate
              </button>
            )}
            <button
              onClick={() => save()}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50"
            >
              {saving ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />} Save
            </button>
            <button onClick={publish} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
              <Send className="h-4 w-4" /> {page.status === "published" ? "Unpublish" : "Publish"}
            </button>
          </>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div className="flex gap-1 rounded-xl border border-gray-200 bg-white p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => (t.key === "revisions" && !isNew ? openRevisions() : setTab(t.key))}
              className={
                "rounded-lg px-3 py-1.5 text-sm font-medium transition " +
                (tab === t.key ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100")
              }
            >
              {t.label}
              {t.key === "sections" && <span className="ml-1.5 text-xs opacity-70">{page.sections.length}</span>}
            </button>
          ))}
        </div>
        <StatusBadge status={page.status} />
      </div>

      {tab === "content" && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <SectionCard title="Page content">
              <div className="space-y-4">
                <Field field={{ name: "title", label: "Title", type: "text", required: true }} value={page.title} onChange={(v) => set("title", v)} />
                <Field field={{ name: "slug", label: "Slug", type: "text", hint: "Leave blank to auto-generate from title" }} value={page.slug} onChange={(v) => set("slug", v)} />
                <Field field={{ name: "excerpt", label: "Excerpt", type: "textarea" }} value={page.excerpt} onChange={(v) => set("excerpt", v)} />
                <Field field={{ name: "content", label: "Body content", type: "richtext" }} value={page.content} onChange={(v) => set("content", v)} />
              </div>
            </SectionCard>
          </div>
          <div className="space-y-4">
            <SectionCard title="Publishing">
              <div className="space-y-4">
                <Field field={{ name: "status", label: "Status", type: "select", options: { draft: "Draft", published: "Published", scheduled: "Scheduled" } }} value={page.status} onChange={(v) => set("status", v)} />
                <Field field={{ name: "published_at", label: "Publish at", type: "text", hint: "YYYY-MM-DD HH:MM" }} value={page.published_at} onChange={(v) => set("published_at", v)} />
                <Field field={{ name: "template", label: "Template", type: "text" }} value={page.template} onChange={(v) => set("template", v)} />
                <Field field={{ name: "is_home", label: "Use as homepage", type: "boolean" }} value={page.is_home} onChange={(v) => set("is_home", v)} />
              </div>
            </SectionCard>
            <SectionCard title="Featured image">
              <Field field={{ name: "featured_media_id", label: "", type: "image" }} value={page.featured_media_id} onChange={(v) => set("featured_media_id", v)} />
            </SectionCard>
          </div>
        </div>
      )}

      {tab === "sections" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Build the page from reusable blocks. Drag order with the arrows.
            </p>
            <button
              onClick={() => setBlockPickerOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" /> Add block
            </button>
          </div>

          {page.sections.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-14 text-center">
              <LayoutTemplate className="mx-auto mb-2 h-7 w-7 text-gray-300" />
              <p className="text-sm text-gray-500">No blocks yet. Add your first block.</p>
            </div>
          ) : (
            page.sections.map((section, index) => {
              const schema = blocks[section.type]?.fields || [];
              const isOpen = expanded[section._key] ?? section.id ?? index;
              return (
                <div key={section._key || section.id || index} className="rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                    <button
                      onClick={() => setExpanded((prev) => ({ ...prev, [section._key || section.id || index]: !isOpen }))}
                      className="flex items-center gap-2 text-sm font-semibold text-gray-800"
                    >
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize">{section.type}</span>
                      {section.name}
                    </button>
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleSectionActive(index)} className={"rounded px-2 py-1 text-xs font-medium " + (section.is_active ? "text-emerald-600" : "text-gray-400")}>
                        {section.is_active ? "Active" : "Hidden"}
                      </button>
                      <button onClick={() => moveSection(index, -1)} className="rounded p-1.5 text-gray-400 hover:bg-gray-100">
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button onClick={() => moveSection(index, 1)} className="rounded p-1.5 text-gray-400 hover:bg-gray-100">
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button onClick={() => removeSection(index)} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {isOpen && (
                    <div className="grid gap-4 p-4 sm:grid-cols-2">
                      {schema.map((field) => (
                        <div key={field.name} className={field.type === "repeater" || field.type === "textarea" || field.type === "richtext" ? "sm:col-span-2" : ""}>
                          <Field
                            field={{ ...field, valueKey: field.type === "image" ? "url" : field.valueKey }}
                            value={section.data?.[field.name] ?? field.default ?? ""}
                            onChange={(v) => updateSectionData(index, field.name, v)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {tab === "seo" && (
        <SectionCard title="Search engine optimization">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field field={{ name: "seo_title", label: "SEO title", type: "text" }} value={page.seo_title} onChange={(v) => set("seo_title", v)} />
            </div>
            <div className="sm:col-span-2">
              <Field field={{ name: "seo_description", label: "Meta description", type: "textarea" }} value={page.seo_description} onChange={(v) => set("seo_description", v)} />
            </div>
            <Field field={{ name: "seo_keywords", label: "Keywords", type: "text" }} value={page.seo_keywords} onChange={(v) => set("seo_keywords", v)} />
            <Field field={{ name: "canonical_url", label: "Canonical URL", type: "url" }} value={page.canonical_url} onChange={(v) => set("canonical_url", v)} />
            <Field field={{ name: "og_title", label: "Open Graph title", type: "text" }} value={page.og_title} onChange={(v) => set("og_title", v)} />
            <Field field={{ name: "og_description", label: "Open Graph description", type: "textarea" }} value={page.og_description} onChange={(v) => set("og_description", v)} />
            <Field field={{ name: "og_image", label: "Open Graph image URL", type: "url" }} value={page.og_image} onChange={(v) => set("og_image", v)} />
            <div className="flex items-end gap-6">
              <Field field={{ name: "robots_index", label: "Index", type: "boolean" }} value={page.robots_index} onChange={(v) => set("robots_index", v)} />
              <Field field={{ name: "robots_follow", label: "Follow", type: "boolean" }} value={page.robots_follow} onChange={(v) => set("robots_follow", v)} />
            </div>
          </div>
        </SectionCard>
      )}

      {tab === "revisions" && (
        <SectionCard title="Revision history">
          {revisions.length === 0 ? (
            <p className="text-sm text-gray-400">No revisions yet.</p>
          ) : (
            <div className="space-y-2">
              {revisions.map((rev) => (
                <div key={rev.id} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{rev.note || "Revision"}</p>
                    <p className="text-xs text-gray-400">
                      {rev.creator?.name || "System"} · {new Date(rev.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button onClick={() => restoreRevision(rev)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                    Restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {!isNew && (
        <button onClick={deletePage} className="mt-8 text-sm text-red-600 hover:underline">
          Delete this page
        </button>
      )}

      <Modal open={blockPickerOpen} onClose={() => setBlockPickerOpen(false)} title="Add a block" size="lg">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Object.entries(blocks).map(([key, block]) => (
            <button
              key={key}
              onClick={() => addSection(key)}
              className="flex flex-col items-start gap-1 rounded-xl border border-gray-200 p-3 text-left transition hover:border-blue-400 hover:bg-blue-50/40"
            >
              <LayoutTemplate className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-800">{block.label}</span>
              <span className="text-xs text-gray-400">{block.fields?.length || 0} fields</span>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}

function normalize(data) {
  return {
    ...data,
    published_at: data.published_at ? data.published_at.slice(0, 16).replace("T", " ") : "",
    sections: (data.sections || []).map((s) => ({ ...s, data: s.data || {} })),
  };
}

function serialize(page) {
  const { sections = [], ...rest } = page;
  return {
    ...rest,
    published_at: rest.published_at ? rest.published_at.replace(" ", "T") : null,
    featured_media_id: rest.featured_media_id || null,
    sections: sections.map((s, index) => ({
      id: s.id,
      type: s.type,
      name: s.name,
      sort_order: index,
      data: s.data || {},
      is_active: s.is_active ?? true,
    })),
  };
}
