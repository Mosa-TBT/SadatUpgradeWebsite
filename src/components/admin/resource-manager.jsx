"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Power } from "lucide-react";
import { api } from "@/lib/admin/api";
import { useAdminAuth } from "@/components/admin/auth-provider";
import { useToast } from "@/components/admin/toast";
import { PageHeader, Modal, ConfirmDialog, Spinner } from "@/components/admin/ui";
import { DataTable } from "@/components/admin/data-table";
import { FormGrid } from "@/components/admin/form-fields";
import { cn } from "@/lib/utils";

export function ResourceManager({
  title,
  description,
  endpoint,
  columns,
  fields,
  defaultValues = {},
  permissions = {},
  searchable = true,
  filters = [],
  transformForEdit,
  transformForSave,
  togglable = false,
  extraRowActions,
  headerActions,
  pageSize = 15,
  modalSize = "md",
  emptyLabel,
}) {
  const { can } = useAdminAuth();
  const toast = useToast();

  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page: 1, lastPage: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const canCreate = permissions.create ? can(permissions.create) : true;
  const canUpdate = permissions.update ? can(permissions.update) : true;
  const canDelete = permissions.delete ? can(permissions.delete) : true;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), per_page: String(pageSize) });
      if (searchable && search) params.set("search", search);
      Object.entries(activeFilters).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      const res = await api.get(`${endpoint}?${params.toString()}`);
      const payload = res.data;
      if (Array.isArray(payload)) {
        setRows(payload);
        setMeta({ page: 1, lastPage: 1, total: payload.length });
      } else {
        setRows(payload.data || []);
        setMeta({
          page: payload.current_page || 1,
          lastPage: payload.last_page || 1,
          total: payload.total || 0,
        });
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, page, pageSize, search, searchable, activeFilters, toast]);

  useEffect(() => {
    const t = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const openCreate = () => {
    setEditing(null);
    setValues({ ...defaultValues });
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setValues(transformForEdit ? transformForEdit(row) : { ...defaultValues, ...row });
    setErrors({});
    setModalOpen(true);
  };

  const setField = (name, value) => setValues((prev) => ({ ...prev, [name]: value }));

  const submit = async () => {
    setSaving(true);
    setErrors({});
    try {
      const payload = transformForSave ? transformForSave(values) : values;
      if (editing) {
        await api.put(`${endpoint}/${editing.id}`, payload);
        toast.success(`${title} updated`);
      } else {
        await api.post(endpoint, payload);
        toast.success(`${title} created`);
      }
      setModalOpen(false);
      load();
    } catch (e) {
      if (e.errors) setErrors(Object.fromEntries(Object.entries(e.errors).map(([k, v]) => [k, v[0]])));
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    if (!confirm) return;
    setDeleting(true);
    try {
      await api.del(`${endpoint}/${confirm.id}`);
      toast.success(`${title} deleted`);
      setConfirm(null);
      load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setDeleting(false);
    }
  };

  const doToggle = async (row) => {
    try {
      await api.post(`${endpoint}/${row.id}/toggle`);
      toast.success("Status updated");
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const allColumns = useMemo(() => {
    const hasActions = canUpdate || canDelete || extraRowActions || togglable;
    if (!hasActions) return columns;
    return [
      ...columns,
      {
        key: "__actions",
        label: "",
        className: "w-1 whitespace-nowrap text-right",
        render: (row) => (
          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
            {extraRowActions?.(row, load)}
            {togglable && canUpdate && (
              <button
                onClick={() => doToggle(row)}
                title="Toggle active"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-blue-600"
              >
                <Power className="h-4 w-4" />
              </button>
            )}
            {canUpdate && (
              <button
                onClick={() => openEdit(row)}
                title="Edit"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-blue-600"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => setConfirm(row)}
                title="Delete"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ),
      },
    ];
  }, [columns, canUpdate, canDelete, togglable, extraRowActions]);

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        actions={
          <>
            {headerActions}
            {canCreate && (
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" /> New
              </button>
            )}
          </>
        }
      />

      {(searchable || filters.length > 0) && (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {searchable && (
            <div className="relative min-w-[240px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                placeholder={`Search ${title.toLowerCase()}…`}
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}
          {filters.map((filter) => (
            <select
              key={filter.name}
              value={activeFilters[filter.name] || ""}
              onChange={(e) => {
                setPage(1);
                setActiveFilters((prev) => ({ ...prev, [filter.name]: e.target.value }));
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">{filter.label}</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      )}

      <DataTable
        columns={allColumns}
        rows={rows}
        loading={loading}
        pagination={{
          page: meta.page,
          lastPage: meta.lastPage,
          total: meta.total,
          onPageChange: setPage,
        }}
        empty={
          <div className="py-6 text-center text-sm text-gray-500">
            {emptyLabel || `No ${title.toLowerCase()} yet.`}
          </div>
        }
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit ${title}` : `New ${title}`}
        size={modalSize}
        footer={
          <>
            <button
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={saving}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60",
              )}
            >
              {saving && <Spinner className="text-white" />}
              {editing ? "Save changes" : "Create"}
            </button>
          </>
        }
      >
        <FormGrid fields={fields} values={values} errors={errors} onChange={setField} />
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={doDelete}
        loading={deleting}
        title={`Delete ${title}`}
        description={`Are you sure you want to delete this ${title.toLowerCase()}? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
