"use client";

import { useEffect, useState } from "react";
import { ResourceManager } from "@/components/admin/resource-manager";
import { Spinner } from "@/components/admin/ui";
import { api } from "@/lib/admin/api";
import type { ApiEnvelope } from "@/types";

interface LanguageOption {
  id: number;
  code: string;
  name: string;
}

interface TranslationRow {
  id: number;
  language_id: number | string;
  group: string;
  key: string;
  value?: string | null;
}

export default function TranslationsPage() {
  const [languages, setLanguages] = useState<LanguageOption[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<ApiEnvelope<LanguageOption[]>>("/admin/languages"),
      api.get<ApiEnvelope<string[]>>("/admin/translations/groups"),
    ])
      .then(([langRes, groupRes]) => {
        setLanguages(langRes.data || []);
        setGroups(groupRes.data || []);
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

  const languageOptions = Object.fromEntries(languages.map((l) => [String(l.id), `${l.name} (${l.code})`]));
  const groupOptions = Object.fromEntries(groups.map((g) => [g, g]));

  return (
    <ResourceManager<TranslationRow>
      title="Translation"
      description="Manage translation strings for each language."
      endpoint="/admin/translations"
      permissions={{ create: "localization.update", update: "localization.update", delete: "localization.update" }}
      searchable
      modalSize="md"
      filters={[
        { name: "language_id", label: "All languages", options: languages.map((l) => ({ value: String(l.id), label: l.name })) },
        ...(groups.length ? [{ name: "group", label: "All groups", options: groups.map((g) => ({ value: g, label: g })) }] : []),
      ]}
      columns={[
        { key: "key", label: "Key", render: (r) => <span className="font-mono text-xs text-gray-700">{r.group}.{r.key}</span> },
        { key: "value", label: "Value", render: (r) => <span className="text-gray-600">{r.value || "—"}</span> },
      ]}
      fields={[
        { name: "language_id", label: "Language", type: "select", options: languageOptions, required: true },
        { name: "group", label: "Group", type: "text", required: true, hint: "e.g. general, navigation" },
        { name: "key", label: "Key", type: "text", required: true },
        { name: "value", label: "Value", type: "textarea", wide: true },
      ]}
      defaultValues={{ group: "general" }}
      transformForEdit={(row) => ({ ...row, language_id: String(row.language_id) })}
      transformForSave={(values) => ({ ...values, language_id: Number(values.language_id) })}
    />
  );
}
