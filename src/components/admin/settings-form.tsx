"use client";

import { useCallback, useEffect, useState } from "react";
import { Save } from "lucide-react";
import { api, asApiError } from "@/lib/admin/api";
import { useAdminAuth } from "@/components/admin/auth-provider";
import { useToast } from "@/components/admin/toast";
import { PageHeader, SectionCard, Spinner, Skeleton } from "@/components/admin/ui";
import { FormGrid } from "@/components/admin/form-fields";
import type { FieldConfig, FieldOptionsInput, FieldValue } from "@/components/admin/form-fields";
import type { ApiEnvelope } from "@/types";

export interface SettingsField {
  key: string;
  label: string;
  value?: unknown;
  type?: string;
  options?: FieldOptionsInput;
  ui_type?: string;
  item_fields?: FieldConfig[];
  encrypted?: boolean;
  configured?: boolean;
  public?: boolean;
}

export interface SettingsFormProps {
  group: string;
  title: string;
  description?: string;
  only?: string[];
}

export function SettingsForm({ group, title, description, only }: SettingsFormProps) {
  const { can } = useAdminAuth();
  const toast = useToast();
  const [fields, setFields] = useState<SettingsField[]>([]);
  const [values, setValues] = useState<Record<string, FieldValue>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiEnvelope<{ fields: SettingsField[] }>>(`/admin/settings/${group}`);
      let list = res.data.fields || [];
      if (only?.length) list = list.filter((f) => only.includes(f.key));
      setFields(list);
      const initial: Record<string, FieldValue> = {};
      list.forEach((f) => {
        initial[f.key] = f.encrypted ? ("" as FieldValue) : (f.value as FieldValue);
      });
      setValues(initial);
    } catch (e: unknown) {
      toast.error(asApiError(e).message);
    } finally {
      setLoading(false);
    }
  }, [group, only, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async () => {
    setSaving(true);
    setErrors({});
    try {
      await api.put(`/admin/settings/${group}`, { values });
      toast.success("Settings saved");
      load();
    } catch (e: unknown) {
      const err = asApiError(e);
      if (err.errors) setErrors(Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v[0]])));
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const formFields: FieldConfig[] = fields.map((f) => {
    const rawType = f.ui_type || f.type || "text";
    const uiType: FieldConfig["type"] =
      rawType === "json" ? "text" : (rawType as FieldConfig["type"]);

    return {
      name: f.key,
      label: f.label + (f.encrypted && f.configured ? " (configured)" : ""),
      type: uiType,
      options: f.options,
      item_fields: f.item_fields,
      hint: f.encrypted && f.configured ? "Leave blank to keep the current value" : f.public ? "Publicly exposed" : undefined,
      wide: f.type === "textarea",
    };
  });

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        actions={
          can("settings.update") && (
            <button
              onClick={submit}
              disabled={saving || loading}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? <Spinner className="text-white" /> : <Save className="h-4 w-4" />} Save settings
            </button>
          )
        }
      />
      <SectionCard>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : (
          <FormGrid
            fields={formFields}
            values={values}
            errors={errors}
            onChange={(name, val) => setValues((prev) => ({ ...prev, [name]: val }))}
          />
        )}
      </SectionCard>
    </div>
  );
}