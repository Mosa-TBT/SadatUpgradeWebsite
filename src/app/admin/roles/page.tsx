"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Copy, ShieldCheck } from "lucide-react";
import { api } from "@/lib/admin/api";
import { useAdminAuth } from "@/components/admin/auth-provider";
import { useToast } from "@/components/admin/toast";
import { PageHeader, Modal, ConfirmDialog, Spinner, TableSkeleton } from "@/components/admin/ui";
import type { ApiEnvelope } from "@/types";

interface PermissionItem {
  id: number;
  slug: string;
  name?: string;
}

type PermissionGroups = Record<string, PermissionItem[]>;

interface RoleRow {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  is_system?: boolean;
  users_count?: number;
  permissions?: PermissionItem[] | null;
}

interface RoleForm {
  name: string;
  slug: string;
  description: string;
  permissions: number[];
}

export default function RolesPage() {
  const { can } = useAdminAuth();
  const toast = useToast();
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [permissions, setPermissions] = useState<PermissionGroups>({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RoleRow | null>(null);
  const [form, setForm] = useState<RoleForm>({ name: "", slug: "", description: "", permissions: [] });
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState<RoleRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rolesRes, permsRes] = await Promise.all([
        api.get<ApiEnvelope<RoleRow[]>>("/admin/roles"),
        api.get<ApiEnvelope<PermissionGroups>>("/admin/permissions"),
      ]);
      setRoles(rolesRes.data || []);
      setPermissions(permsRes.data || {});
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", slug: "", description: "", permissions: [] });
    setModalOpen(true);
  };

  const openEdit = (role: RoleRow) => {
    setEditing(role);
    setForm({
      name: role.name,
      slug: role.slug,
      description: role.description || "",
      permissions: (role.permissions || []).map((p) => p.id),
    });
    setModalOpen(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) await api.put(`/admin/roles/${editing.id}`, form);
      else await api.post("/admin/roles", form);
      toast.success("Role saved");
      setModalOpen(false);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  const duplicate = async (role: RoleRow) => {
    try {
      await api.post(`/admin/roles/${role.id}/duplicate`);
      toast.success("Role duplicated");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  };

  const doDelete = async () => {
    setDeleting(true);
    try {
      await api.del(`/admin/roles/${confirm?.id}`);
      toast.success("Role deleted");
      setConfirm(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setDeleting(false);
    }
  };

  const togglePermission = (id: number) =>
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(id)
        ? prev.permissions.filter((p) => p !== id)
        : [...prev.permissions, id],
    }));

  return (
    <div>
      <PageHeader
        title="Roles & Permissions"
        description="Define what each type of administrator can access."
        actions={
          can("roles.create") && (
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" /> New role
            </button>
          )
        }
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Slug</th>
              <th className="px-4 py-3 font-semibold">Users</th>
              <th className="px-4 py-3 font-semibold">Permissions</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6">
                  <TableSkeleton cols={5} />
                </td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr key={role.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 font-medium text-gray-900">
                      {role.is_system && <ShieldCheck className="h-4 w-4 text-blue-500" />}
                      {role.name}
                    </div>
                    {role.description && <p className="text-xs text-gray-400">{role.description}</p>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{role.slug}</td>
                  <td className="px-4 py-3 text-gray-600">{role.users_count ?? 0}</td>
                  <td className="px-4 py-3 text-gray-600">{(role.permissions || []).length}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      {can("roles.create") && (
                        <button onClick={() => duplicate(role)} title="Duplicate" className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600">
                          <Copy className="h-4 w-4" />
                        </button>
                      )}
                      {can("roles.update") && (
                        <button onClick={() => openEdit(role)} title="Edit" className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600">
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                      {can("roles.delete") && !role.is_system && (
                        <button onClick={() => setConfirm(role)} title="Delete" className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit role — ${editing.name}` : "New role"}
        size="lg"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving || !form.name}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving && <Spinner className="text-white" />} Save role
            </button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Slug</label>
            <input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} placeholder="auto" className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <p className="text-sm font-semibold text-gray-800">Permissions</p>
          {Object.entries(permissions).map(([group, items]) => (
            <div key={group}>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">{group}</p>
              <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                {items.map((perm) => (
                  <label key={perm.id} className="flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={form.permissions.includes(perm.id)}
                      onChange={() => togglePermission(perm.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="font-mono text-xs">{perm.slug}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={doDelete}
        loading={deleting}
        title="Delete role"
        description={`Delete "${confirm?.name}"? Users assigned to this role will lose it.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
