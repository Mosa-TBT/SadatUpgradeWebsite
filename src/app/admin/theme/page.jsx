"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Save, RotateCcw, UploadCloud, Copy, Trash2, Check, Eye, History, Sun, Moon } from "lucide-react";
import { api } from "@/lib/admin/api";
import { useAdminAuth } from "@/components/admin/auth-provider";
import { useToast } from "@/components/admin/toast";
import { PageHeader, SectionCard, Modal, Spinner, ConfirmDialog } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

const COLOR_KEYS = [
  "primary", "secondary", "accent", "background", "surface", "card",
  "text", "muted", "border", "success", "warning", "danger", "info",
];
const COLOR_LABELS = {
  primary: "Primary", secondary: "Secondary", accent: "Accent", background: "Background",
  surface: "Surface", card: "Card", text: "Text", muted: "Muted text", border: "Border",
  success: "Success", warning: "Warning", danger: "Error", info: "Info",
};
const DARK_COLOR_KEYS = ["background", "surface", "card", "text", "muted", "border", "primary", "secondary"];
const TABS = [
  { key: "colors", label: "Colors" },
  { key: "dark", label: "Dark mode" },
  { key: "typography", label: "Typography" },
  { key: "layout", label: "Layout" },
  { key: "presets", label: "Themes" },
];

export default function ThemePage() {
  const { can } = useAdminAuth();
  const toast = useToast();
  const [tab, setTab] = useState("colors");
  const [themes, setThemes] = useState([]);
  const [activeThemeId, setActiveThemeId] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [defaults, setDefaults] = useState(null);
  const [presets, setPresets] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewDark, setPreviewDark] = useState(false);
  const [versions, setVersions] = useState([]);
  const [versionsOpen, setVersionsOpen] = useState(false);
  const [newThemeOpen, setNewThemeOpen] = useState(false);
  const [newThemeName, setNewThemeName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [themeRes, presetRes] = await Promise.all([
        api.get("/admin/themes"),
        api.get("/admin/themes/presets"),
      ]);
      const active = themeRes.data.themes.find((t) => t.is_active);
      setThemes(themeRes.data.themes);
      setDefaults(themeRes.data.defaults);
      setActiveThemeId(active?.id ?? null);
      setTokens(active ? deepMerge(themeRes.data.defaults, active.tokens) : themeRes.data.defaults);
      setPresets(presetRes.data || {});
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const activeTheme = useMemo(() => themes.find((t) => t.id === activeThemeId), [themes, activeThemeId]);

  const setToken = (section, key, value) =>
    setTokens((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } }));

  const isDirty = useMemo(() => {
    if (!tokens || !activeTheme) return false;
    return JSON.stringify(deepMerge(defaults, activeTheme.tokens)) !== JSON.stringify(tokens);
  }, [tokens, activeTheme, defaults]);

  const save = async () => {
    if (!activeTheme) return;
    setSaving(true);
    try {
      await api.put(`/admin/themes/${activeTheme.id}`, {
        name: activeTheme.name,
        description: activeTheme.description,
        tokens,
      });
      toast.success("Theme saved");
      load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    if (!activeTheme) return;
    if (isDirty) await save();
    try {
      await api.post(`/admin/themes/${activeTheme.id}/activate`);
      toast.success("Theme published");
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const applyPreset = (key) => {
    const preset = presets[key];
    if (!preset) return;
    setTokens(deepMerge(defaults, preset.tokens));
    toast.info(`${preset.name} preset loaded — save to apply`);
  };

  const activateTheme = async (id) => {
    try {
      await api.post(`/admin/themes/${id}/activate`);
      toast.success("Theme activated");
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const duplicateTheme = async (id) => {
    try {
      await api.post(`/admin/themes/${id}/duplicate`);
      toast.success("Theme duplicated");
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const createTheme = async () => {
    try {
      await api.post("/admin/themes", { name: newThemeName || "Custom Theme", tokens });
      toast.success("Theme created");
      setNewThemeOpen(false);
      setNewThemeName("");
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const deleteTheme = async () => {
    if (!confirmDelete) return;
    try {
      await api.del(`/admin/themes/${confirmDelete.id}`);
      toast.success("Theme deleted");
      setConfirmDelete(null);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const openVersions = async () => {
    if (!activeTheme) return;
    try {
      const res = await api.get(`/admin/themes/${activeTheme.id}/versions`);
      setVersions(res.data || []);
      setVersionsOpen(true);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const restoreVersion = async (version) => {
    try {
      await api.post(`/admin/themes/${activeTheme.id}/versions/${version}/restore`);
      toast.success(`Restored version ${version}`);
      setVersionsOpen(false);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (loading || !tokens) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="h-7 w-7" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Appearance"
        description="Customize your website's design tokens. Changes preview instantly."
        actions={
          <>
            <button
              onClick={() => setTokens(defaults)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
            <button
              onClick={openVersions}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <History className="h-4 w-4" /> Versions
            </button>
            <button
              onClick={save}
              disabled={saving || !isDirty || !can("theme.update")}
              className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50"
            >
              {saving ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />} Save changes
            </button>
            <button
              onClick={publish}
              disabled={!can("theme.publish")}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <UploadCloud className="h-4 w-4" /> Publish
            </button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        {/* Controls */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1 rounded-xl border border-gray-200 bg-white p-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition",
                  tab === t.key ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "colors" && (
            <SectionCard title="Brand colors">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {COLOR_KEYS.map((key) => (
                  <ColorRow
                    key={key}
                    label={COLOR_LABELS[key]}
                    value={tokens.colors[key]}
                    onChange={(v) => setToken("colors", key, v)}
                  />
                ))}
              </div>
            </SectionCard>
          )}

          {tab === "dark" && (
            <SectionCard title="Dark mode">
              <ToggleRow
                label="Enable dark mode"
                checked={tokens.dark_mode.enabled}
                onChange={(v) => setToken("dark_mode", "enabled", v)}
              />
              <ToggleRow
                label="Follow system preference"
                checked={tokens.dark_mode.auto}
                onChange={(v) => setToken("dark_mode", "auto", v)}
              />
              <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-2">
                {DARK_COLOR_KEYS.map((key) => (
                  <ColorRow
                    key={key}
                    label={COLOR_LABELS[key]}
                    value={tokens.dark[key]}
                    onChange={(v) => setToken("dark", key, v)}
                  />
                ))}
              </div>
            </SectionCard>
          )}

          {tab === "typography" && (
            <SectionCard title="Typography">
              <div className="space-y-3">
                <TextRow label="Primary font" value={tokens.typography.font_primary} onChange={(v) => setToken("typography", "font_primary", v)} />
                <TextRow label="Heading font" value={tokens.typography.font_heading} onChange={(v) => setToken("typography", "font_heading", v)} />
                <TextRow label="Base font size (px)" type="number" value={tokens.typography.font_size_base} onChange={(v) => setToken("typography", "font_size_base", v)} />
                <TextRow label="Base font weight" value={tokens.typography.font_weight_base} onChange={(v) => setToken("typography", "font_weight_base", v)} />
                <TextRow label="Heading weight" value={tokens.typography.heading_weight} onChange={(v) => setToken("typography", "heading_weight", v)} />
                <TextRow label="Line height" value={tokens.typography.line_height} onChange={(v) => setToken("typography", "line_height", v)} />
                <TextRow label="Letter spacing (em)" value={tokens.typography.letter_spacing} onChange={(v) => setToken("typography", "letter_spacing", v)} />
              </div>
            </SectionCard>
          )}

          {tab === "layout" && (
            <SectionCard title="Layout">
              <div className="space-y-3">
                <TextRow label="Border radius (rem)" value={tokens.layout.radius} onChange={(v) => setToken("layout", "radius", v)} />
                <TextRow label="Sidebar width (px)" type="number" value={tokens.layout.sidebar_width} onChange={(v) => setToken("layout", "sidebar_width", v)} />
                <TextRow label="Header height (px)" type="number" value={tokens.layout.header_height} onChange={(v) => setToken("layout", "header_height", v)} />
                <TextRow label="Content max width (px)" type="number" value={tokens.layout.content_max_width} onChange={(v) => setToken("layout", "content_max_width", v)} />
                <SelectRow label="Card style" value={tokens.layout.card_style} options={["elevated", "flat", "bordered"]} onChange={(v) => setToken("layout", "card_style", v)} />
                <SelectRow label="Button style" value={tokens.layout.button_style} options={["rounded", "square", "pill"]} onChange={(v) => setToken("layout", "button_style", v)} />
                <SelectRow label="Input style" value={tokens.layout.input_style} options={["outline", "filled", "underline"]} onChange={(v) => setToken("layout", "input_style", v)} />
                <SelectRow label="Shadow intensity" value={tokens.layout.shadow_intensity} options={["none", "subtle", "soft", "strong"]} onChange={(v) => setToken("layout", "shadow_intensity", v)} />
              </div>
            </SectionCard>
          )}

          {tab === "presets" && (
            <div className="space-y-4">
              <SectionCard title="Theme presets" description="Start from a ready-made look">
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(presets).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => applyPreset(key)}
                      className="rounded-lg border border-gray-200 p-3 text-left transition hover:border-blue-400 hover:bg-blue-50/40"
                    >
                      <div className="mb-2 flex gap-1">
                        {["primary", "secondary", "accent", "background"].map((c) => (
                          <span
                            key={c}
                            className="h-5 w-5 rounded-full border border-black/10"
                            style={{ background: preset.tokens.colors[c] }}
                          />
                        ))}
                      </div>
                      <p className="text-sm font-medium text-gray-800">{preset.name}</p>
                    </button>
                  ))}
                </div>
              </SectionCard>

              <SectionCard
                title="Saved themes"
                actions={
                  can("theme.update") && (
                    <button
                      onClick={() => setNewThemeOpen(true)}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      + New
                    </button>
                  )
                }
              >
                <div className="space-y-2">
                  {themes.map((theme) => (
                    <div
                      key={theme.id}
                      className={cn(
                        "flex items-center justify-between rounded-lg border px-3 py-2",
                        theme.is_active ? "border-emerald-300 bg-emerald-50/50" : "border-gray-200",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {theme.is_active && <Check className="h-4 w-4 text-emerald-600" />}
                        <span className="text-sm font-medium">{theme.name}</span>
                        {theme.is_system && (
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                            preset
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {!theme.is_active && (
                          <button
                            onClick={() => activateTheme(theme.id)}
                            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-emerald-600"
                            title="Activate"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => duplicateTheme(theme.id)}
                          className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        {!theme.is_active && (
                          <button
                            onClick={() => setConfirmDelete(theme)}
                            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          )}
        </div>

        {/* Live preview */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="mb-3 flex items-center justify-between">
            <p className="inline-flex items-center gap-2 text-sm font-medium text-gray-600">
              <Eye className="h-4 w-4" /> Live preview
              {isDirty && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">unsaved</span>}
            </p>
            <button
              onClick={() => setPreviewDark((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              {previewDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              {previewDark ? "Light" : "Dark"}
            </button>
          </div>
          <ThemePreview tokens={tokens} dark={previewDark} />
        </div>
      </div>

      <Modal open={newThemeOpen} onClose={() => setNewThemeOpen(false)} title="Save as new theme" size="sm"
        footer={
          <>
            <button onClick={() => setNewThemeOpen(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={createTheme} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Create</button>
          </>
        }
      >
        <input
          value={newThemeName}
          onChange={(e) => setNewThemeName(e.target.value)}
          placeholder="Theme name"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </Modal>

      <Modal open={versionsOpen} onClose={() => setVersionsOpen(false)} title="Version history" size="md">
        <div className="space-y-2">
          {versions.length === 0 && <p className="text-sm text-gray-400">No versions yet.</p>}
          {versions.map((v) => (
            <div key={v.id} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
              <div>
                <p className="text-sm font-medium">Version {v.version}</p>
                <p className="text-xs text-gray-400">
                  {v.note} · {new Date(v.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => restoreVersion(v.version)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Restore
              </button>
            </div>
          ))}
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={deleteTheme}
        title="Delete theme"
        description={`Delete "${confirmDelete?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}

function ColorRow({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-10 cursor-pointer rounded border border-gray-300 bg-white"
        />
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-2 py-1.5 font-mono text-xs uppercase focus:border-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition", checked ? "bg-blue-600" : "bg-gray-300")}
      >
        <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition", checked ? "translate-x-6" : "translate-x-1")} />
      </button>
    </div>
  );
}

function TextRow({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />
    </div>
  );
}

function SelectRow({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm capitalize focus:border-blue-500 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function ThemePreview({ tokens, dark }) {
  const c = dark ? { ...tokens.colors, ...tokens.dark } : tokens.colors;
  const radius =
    tokens.layout.radius === "0" ? "0px" : `calc(${tokens.layout.radius || "0.5rem"} * 1)`;
  const buttonRadius =
    tokens.layout.button_style === "pill" ? "999px" : tokens.layout.button_style === "square" ? "0px" : radius;

  return (
    <div
      className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm"
      style={{ background: c.background, color: c.text, fontFamily: `'${tokens.typography.font_primary}', sans-serif` }}
    >
      {/* mock browser bar */}
      <div className="flex items-center gap-1.5 border-b px-4 py-2" style={{ borderColor: c.border, background: c.surface }}>
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-3 text-xs" style={{ color: c.muted }}>sadatupgrade.com</span>
      </div>

      {/* mock nav */}
      <div className="flex items-center justify-between border-b px-6 py-3" style={{ borderColor: c.border, background: c.card }}>
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold" style={{ background: c.primary, color: c.primary_foreground || "#fff" }}>S</span>
          <span className="text-sm font-bold" style={{ color: c.text }}>Sadat Upgrade</span>
        </div>
        <div className="hidden gap-5 sm:flex">
          {["Home", "Services", "Portfolio", "Contact"].map((item, i) => (
            <span key={item} className="text-xs font-medium" style={{ color: i === 0 ? c.primary : c.muted }}>{item}</span>
          ))}
        </div>
        <span className="px-3 py-1.5 text-xs font-semibold" style={{ background: c.primary, color: c.primary_foreground || "#fff", borderRadius: buttonRadius }}>
          Get Started
        </span>
      </div>

      {/* hero */}
      <div className="px-6 py-10" style={{ background: c.background }}>
        <span className="inline-block px-2.5 py-1 text-[10px] font-semibold" style={{ background: `${c.primary}1a`, color: c.primary, borderRadius: radius }}>
          Digital Innovation Agency
        </span>
        <h1 className="mt-3 max-w-md text-2xl font-bold leading-tight" style={{ color: c.text, fontWeight: tokens.typography.heading_weight, lineHeight: tokens.typography.line_height }}>
          We Build Digital Experiences That Drive Results
        </h1>
        <p className="mt-2 max-w-md text-sm" style={{ color: c.muted }}>
          Transform your business with cutting-edge web solutions and powerful digital strategies.
        </p>
        <div className="mt-5 flex gap-3">
          <span className="px-4 py-2 text-xs font-semibold" style={{ background: c.primary, color: c.primary_foreground || "#fff", borderRadius: buttonRadius }}>
            Start Your Project
          </span>
          <span className="px-4 py-2 text-xs font-semibold" style={{ border: `1px solid ${c.border}`, color: c.text, borderRadius: buttonRadius }}>
            View Our Work
          </span>
        </div>
      </div>

      {/* cards */}
      <div className="grid grid-cols-3 gap-3 px-6 pb-8" style={{ background: c.background }}>
        {[
          { t: "Web Development", d: "Modern, fast websites." },
          { t: "Mobile Apps", d: "Native experiences." },
          { t: "UI/UX Design", d: "Design that converts." },
        ].map((card) => (
          <div key={card.t} className="p-3" style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: radius }}>
            <span className="mb-2 flex h-7 w-7 items-center justify-center" style={{ background: `${c.secondary}1a`, color: c.secondary, borderRadius: radius }}>
              <span className="h-3 w-3 rounded-sm" style={{ background: c.secondary }} />
            </span>
            <p className="text-xs font-semibold" style={{ color: c.text }}>{card.t}</p>
            <p className="mt-0.5 text-[10px]" style={{ color: c.muted }}>{card.d}</p>
          </div>
        ))}
      </div>

      {/* footer strip */}
      <div className="flex items-center justify-between px-6 py-3 text-[10px]" style={{ background: c.surface, color: c.muted, borderTop: `1px solid ${c.border}` }}>
        <span>© {new Date().getFullYear()} Sadat Upgrade</span>
        <span style={{ color: c.success }}>● Live preview</span>
      </div>
    </div>
  );
}

function deepMerge(base, override) {
  const out = { ...base };
  Object.entries(override || {}).forEach(([key, value]) => {
    if (value && typeof value === "object" && !Array.isArray(value) && base[key] && typeof base[key] === "object") {
      out[key] = deepMerge(base[key], value);
    } else {
      out[key] = value;
    }
  });
  return out;
}
