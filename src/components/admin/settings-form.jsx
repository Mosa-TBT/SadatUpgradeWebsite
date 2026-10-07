"use client";

import { useCallback, useEffect, useState } from "react";
import { Save } from "lucide-react";
import { api } from "@/lib/admin/api";
import { useAdminAuth } from "@/components/admin/auth-provider";
import { useToast } from "@/components/admin/toast";
import { PageHeader, SectionCard, Spinner, Skeleton } from "@/components/admin/ui";
import { FormGrid } from "@/components/admin/form-fields";

export function SettingsForm({ group, title, description, only }) {
  const { can } = useAdminAuth();
  const toast = useToast();
  const [fields, setFields] = useState([]);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/settings/${group}`);
      let list = res.data.fields || [];
      if (only?.length) list = list.filter((f) => only.includes(f.key));
      setFields(list);
      const initial = {};
      list.forEach((f) => {
        initial[f.key] = f.encrypted ? "" : f.value;
      });
      setValues(initial);
    } catch (e) {
      toast.error(e.message);
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
    } catch (e) {
      if (e.errors) setErrors(Object.fromEntries(Object.entries(e.errors).map(([k, v]) => [k, v[0]])));
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const formFields = fields.map((f) => ({
    name: f.key,
    label: f.label + (f.encrypted && f.configured ? " (configured)" : ""),
    type: f.type,
    options: f.options,
    hint: f.encrypted && f.configured ? "Leave blank to keep the current value" : f.public ? "Publicly exposed" : undefined,
    wide: f.type === "textarea",
  }));

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
