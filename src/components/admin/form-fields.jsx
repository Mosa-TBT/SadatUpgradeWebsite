"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageField } from "@/components/admin/media-picker";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

function normalizeOptions(options) {
  if (!options) return [];
  if (Array.isArray(options)) {
    return options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  }
  return Object.entries(options).map(([value, label]) => ({ value, label }));
}

export function Field({ field, value, onChange, error }) {
  const { type = "text", label, hint, placeholder, required, options } = field;

  const common = {
    id: field.name,
    value: value ?? "",
    placeholder,
    onChange: (e) => onChange(e.target.value),
    className: cn(inputClass, error && "border-red-400 focus:border-red-500 focus:ring-red-500"),
  };

  let control;

  switch (type) {
    case "textarea":
    case "richtext":
      control = <textarea {...common} rows={type === "richtext" ? 8 : 4} />;
      break;
    case "boolean":
      control = (
        <button
          type="button"
          role="switch"
          aria-checked={!!value}
          onClick={() => onChange(!value)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition",
            value ? "bg-blue-600" : "bg-gray-300",
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition",
              value ? "translate-x-6" : "translate-x-1",
            )}
          />
        </button>
      );
      break;
    case "number":
      control = (
        <input
          type="number"
          {...common}
          onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        />
      );
      break;
    case "select":
      control = (
        <select {...common} onChange={(e) => onChange(e.target.value)}>
          <option value="">— Select —</option>
          {normalizeOptions(options).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
      break;
    case "color":
      control = (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value || "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="h-9 w-12 cursor-pointer rounded border border-gray-300 bg-white"
          />
          <input
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            className={cn(inputClass, "font-mono uppercase")}
          />
        </div>
      );
      break;
    case "image":
    case "media":
      control = (
        <ImageField
          value={value}
          onChange={onChange}
          valueKey={field.valueKey || "id"}
        />
      );
      break;
    case "tags":
    case "string-array":
      control = <TagInput value={value || []} onChange={onChange} />;
      break;
    case "multiselect":
      control = <MultiSelect options={normalizeOptions(options)} value={value || []} onChange={onChange} />;
      break;
    case "repeater":
      control = <Repeater field={field} value={value || []} onChange={onChange} />;
      break;
    default:
      control = <input {...common} type={type === "password" ? "password" : "text"} />;
  }

  return (
    <div className={field.wide ? "sm:col-span-2" : ""}>
      {label && (
        <label htmlFor={field.name} className="mb-1 block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {control}
      {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function FormGrid({ fields, values, errors = {}, onChange, columns = 2 }) {
  return (
    <div className={cn("grid gap-4", columns === 1 ? "grid-cols-1" : "sm:grid-cols-2")}>
      {fields.map((field) => (
        <Field
          key={field.name}
          field={field}
          value={values[field.name]}
          error={errors[field.name]}
          onChange={(val) => onChange(field.name, val)}
        />
      ))}
    </div>
  );
}

export function TagInput({ value, onChange, placeholder = "Add value and press Enter" }) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...(value || []), v]);
    setDraft("");
  };

  return (
    <div className="rounded-lg border border-gray-300 p-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
      <div className="flex flex-wrap gap-1.5">
        {(value || []).map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((_, i) => i !== index))}
              className="text-gray-400 hover:text-red-500"
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          onBlur={add}
          placeholder={placeholder}
          className="min-w-[140px] flex-1 border-none px-1 py-1 text-sm focus:outline-none"
        />
      </div>
    </div>
  );
}

export function MultiSelect({ options, value, onChange }) {
  const selected = (value || []).map(String);

  const toggle = (val) => {
    const v = String(val);
    if (selected.includes(v)) {
      onChange(selected.filter((s) => s !== v));
    } else {
      onChange([...selected, v]);
    }
  };

  return (
    <div className="max-h-44 space-y-1 overflow-y-auto rounded-lg border border-gray-300 p-2">
      {options.length === 0 && <p className="px-1 py-2 text-xs text-gray-400">No options</p>}
      {options.map((opt) => (
        <label key={opt.value} className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-sm hover:bg-gray-50">
          <input
            type="checkbox"
            checked={selected.includes(String(opt.value))}
            onChange={() => toggle(opt.value)}
            className="h-4 w-4 rounded border-gray-300"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

export function Repeater({ field, value, onChange }) {
  const itemFields = field.item_fields || [];
  const items = value || [];

  const update = (index, name, val) => {
    const next = items.map((item, i) => (i === index ? { ...item, [name]: val } : item));
    onChange(next);
  };

  const remove = (index) => onChange(items.filter((_, i) => i !== index));

  const add = () => onChange([...items, {}]);

  const move = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
              <GripVertical className="h-3.5 w-3.5" /> Item {index + 1}
            </span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => move(index, -1)} className="rounded p-1 text-gray-400 hover:text-gray-700">↑</button>
              <button type="button" onClick={() => move(index, 1)} className="rounded p-1 text-gray-400 hover:text-gray-700">↓</button>
              <button type="button" onClick={() => remove(index)} className="rounded p-1 text-gray-400 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <FormGrid
            fields={itemFields}
            values={item}
            columns={2}
            onChange={(name, val) => update(index, name, val)}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600"
      >
        <Plus className="h-4 w-4" /> Add item
      </button>
    </div>
  );
}
