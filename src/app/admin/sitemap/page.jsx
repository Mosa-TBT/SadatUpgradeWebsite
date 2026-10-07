"use client";

import { useEffect, useState } from "react";
import { ExternalLink, RefreshCw } from "lucide-react";
import { api, API_URL } from "@/lib/admin/api";
import { PageHeader, SectionCard, StatCard, Spinner } from "@/components/admin/ui";
import { useToast } from "@/components/admin/toast";

const API_ORIGIN = API_URL.replace(/\/api$/, "");

export default function SitemapPage() {
  const toast = useToast();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    api
      .get("/admin/system/info")
      .then((res) => setInfo(res.data))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [toast]);

  const regenerate = async () => {
    setRegenerating(true);
    try {
      await api.post("/admin/system/cache", { action: "clear_cache" });
      toast.success("Cache cleared — sitemap will rebuild on next request");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setRegenerating(false);
    }
  };

  const sitemapUrl = `${API_ORIGIN}/sitemap.xml`;

  return (
    <div>
      <PageHeader
        title="Sitemap"
        description="Your sitemap is generated dynamically from published pages and posts."
        actions={
          <>
            <button
              onClick={regenerate}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {regenerating ? <Spinner className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />} Regenerate
            </button>
            <a
              href={sitemapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <ExternalLink className="h-4 w-4" /> Open sitemap.xml
            </a>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Sitemap URL" value={<span className="text-sm">/sitemap.xml</span>} hint={sitemapUrl} />
        <StatCard label="Status" value={loading ? "…" : "Active"} hint="Enabled by default in SEO settings" />
        <StatCard label="Source" value="Dynamic" hint="Published pages & posts" />
      </div>

      <div className="mt-6">
        <SectionCard title="How it works">
          <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600">
            <li>All published pages (except the home slug) are included automatically.</li>
            <li>All published blog posts are included under <code className="rounded bg-gray-100 px-1">/blog/&#123;slug&#125;</code>.</li>
            <li>You can disable the sitemap in <strong>SEO Settings → Sitemap Enabled</strong>.</li>
            <li>The endpoint returns a standards-compliant XML <code className="rounded bg-gray-100 px-1">urlset</code>.</li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
