"use client";

import { useEffect, useState } from "react";
import { KeyRound, ShieldCheck, UserCheck, UserX } from "lucide-react";
import { ResourceManager } from "@/components/admin/resource-manager";
import { StatusBadge, Modal, Spinner } from "@/components/admin/ui";
import { api } from "@/lib/admin/api";
import { useToast } from "@/components/admin/toast";

export default function UsersPage() {
  const toast = useToast();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetUser, setResetUser] = useState(null);
  const [passwords, setPasswords] = useState({ password: "", password_confirmation: "" });
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    api
      .get("/admin/roles")
      .then((res) => setRoles(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const doReset = async () => {
    setResetting(true);
    try {
      await api.post(`/admin/users/${resetUser.id}/reset-password`, passwords);
      toast.success("Password reset");
      setResetUser(null);
      setPasswords({ password: "", password_confirmation: "" });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="h-7 w-7" />
      </div>
    );
  }

  const roleOptions = Object.fromEntries(roles.map((r) => [String(r.id), r.name]));

  return (
    <>
      <ResourceManager
        title="User"
        description="Manage admin and website members, roles and access."
        endpoint="/admin/users"
        permissions={{ create: "users.create", update: "users.update", delete: "users.delete" }}
        searchable
        filters={[
          { name: "status", label: "All statuses", options: [
            { value: "active", label: "Active" },
            { value: "suspended", label: "Suspended" },
            { value: "pending", label: "Pending" },
          ] },
        ]}
        columns={[
          {
            key: "name",
            label: "User",
            render: (r) => (
              <div>
                <p className="font-medium text-gray-900">{r.name}</p>
                <p className="text-xs text-gray-400">{r.email}</p>
              </div>
            ),
          },
          { key: "roles", label: "Roles", render: (r) => (r.roles || []).map((x) => x.name).join(", ") || "—" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
          {
            key: "last_login_at",
            label: "Last login",
            render: (r) => (r.last_login_at ? new Date(r.last_login_at).toLocaleDateString() : "Never"),
          },
        ]}
        extraRowActions={(row, reload) => (
          <>
            <button
              onClick={async () => {
                try {
                  await api.post(`/admin/users/${row.id}/toggle-status`);
                  toast.success("User status updated");
                  reload();
                } catch (e) {
                  toast.error(e.message);
                }
              }}
              title={row.status === "active" ? "Suspend" : "Activate"}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-amber-600"
            >
              {row.status === "active" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
            </button>
            <button
              onClick={async () => {
                try {
                  await api.post(`/admin/users/${row.id}/verify`);
                  toast.success("User verified");
                  reload();
                } catch (e) {
                  toast.error(e.message);
                }
              }}
              title="Verify email"
              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-blue-600"
            >
              <ShieldCheck className="h-4 w-4" />
            </button>
            <button
              onClick={() => setResetUser(row)}
              title="Reset password"
              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-purple-600"
            >
              <KeyRound className="h-4 w-4" />
            </button>
          </>
        )}
        fields={[
          { name: "name", label: "Name", type: "text", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "phone", label: "Phone", type: "text" },
          { name: "job_title", label: "Job title", type: "text" },
          { name: "status", label: "Status", type: "select", options: { active: "Active", suspended: "Suspended", pending: "Pending" } },
          { name: "roles", label: "Roles", type: "multiselect", options: roleOptions, wide: true },
          { name: "password", label: "Password", type: "password", hint: "Leave blank when editing" },
          { name: "password_confirmation", label: "Confirm password", type: "password" },
          { name: "avatar_media_id", label: "Avatar", type: "image" },
          { name: "bio", label: "Bio", type: "textarea", wide: true },
        ]}
        defaultValues={{ status: "active", roles: [] }}
        transformForEdit={(row) => ({
          ...row,
          password: "",
          password_confirmation: "",
          roles: (row.roles || []).map((r) => String(r.id)),
        })}
        transformForSave={(values) => ({
          ...values,
          roles: (values.roles || []).map(Number),
        })}
      />

      <Modal
        open={!!resetUser}
        onClose={() => setResetUser(null)}
        title={`Reset password — ${resetUser?.name ?? ""}`}
        size="sm"
        footer={
          <>
            <button onClick={() => setResetUser(null)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={doReset}
              disabled={resetting || !passwords.password}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {resetting && <Spinner className="text-white" />} Reset password
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <input
            type="password"
            placeholder="New password"
            value={passwords.password}
            onChange={(e) => setPasswords((p) => ({ ...p, password: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={passwords.password_confirmation}
            onChange={(e) => setPasswords((p) => ({ ...p, password_confirmation: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </Modal>
    </>
  );
}
