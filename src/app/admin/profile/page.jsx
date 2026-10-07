"use client";

import { useCallback, useEffect, useState } from "react";
import { Save, KeyRound, Monitor, LogOut } from "lucide-react";
import { api, setToken } from "@/lib/admin/api";
import { useAdminAuth } from "@/components/admin/auth-provider";
import { useToast } from "@/components/admin/toast";
import { PageHeader, SectionCard, Spinner, Skeleton } from "@/components/admin/ui";
import { Field } from "@/components/admin/form-fields";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { setUser } = useAdminAuth();
  const toast = useToast();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [password, setPassword] = useState({ current_password: "", password: "", password_confirmation: "" });
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, sessionsRes] = await Promise.all([
        api.get("/admin/profile"),
        api.get("/auth/sessions"),
      ]);
      setProfile(profileRes.data);
      setSessions(sessionsRes.data || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const set = (name, value) => setProfile((prev) => ({ ...prev, [name]: value }));

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await api.put("/admin/profile", {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        job_title: profile.job_title,
        bio: profile.bio,
        timezone: profile.timezone,
        locale: profile.locale,
        avatar_media_id: profile.avatar_media_id,
      });
      setProfile(res.data);
      const me = await api.get("/auth/me");
      setUser(me.data);
      toast.success("Profile updated");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async () => {
    setSavingPassword(true);
    try {
      await api.put("/admin/profile/password", password);
      toast.success("Password updated");
      setPassword({ current_password: "", password: "", password_confirmation: "" });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSavingPassword(false);
    }
  };

  const revoke = async (id) => {
    try {
      await api.del(`/auth/sessions/${id}`);
      toast.success("Session revoked");
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const logoutAll = async () => {
    try {
      await api.post("/auth/logout-all");
      setToken(null);
      router.push("/admin/login");
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (loading || !profile) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="My Profile" description="Manage your account, password and active sessions." />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard
            title="Profile information"
            actions={
              <button
                onClick={saveProfile}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? <Spinner className="text-white" /> : <Save className="h-4 w-4" />} Save
              </button>
            }
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field field={{ name: "name", label: "Name", type: "text" }} value={profile.name} onChange={(v) => set("name", v)} />
              <Field field={{ name: "email", label: "Email", type: "email" }} value={profile.email} onChange={(v) => set("email", v)} />
              <Field field={{ name: "phone", label: "Phone", type: "text" }} value={profile.phone} onChange={(v) => set("phone", v)} />
              <Field field={{ name: "job_title", label: "Job title", type: "text" }} value={profile.job_title} onChange={(v) => set("job_title", v)} />
              <Field field={{ name: "timezone", label: "Timezone", type: "text" }} value={profile.timezone} onChange={(v) => set("timezone", v)} />
              <Field field={{ name: "locale", label: "Locale", type: "text" }} value={profile.locale} onChange={(v) => set("locale", v)} />
              <div className="sm:col-span-2">
                <Field field={{ name: "bio", label: "Bio", type: "textarea" }} value={profile.bio} onChange={(v) => set("bio", v)} />
              </div>
              <div className="sm:col-span-2">
                <Field field={{ name: "avatar_media_id", label: "Avatar", type: "image" }} value={profile.avatar_media_id} onChange={(v) => set("avatar_media_id", v)} />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Change password">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field field={{ name: "current_password", label: "Current password", type: "password" }} value={password.current_password} onChange={(v) => setPassword((p) => ({ ...p, current_password: v }))} />
              </div>
              <Field field={{ name: "password", label: "New password", type: "password" }} value={password.password} onChange={(v) => setPassword((p) => ({ ...p, password: v }))} />
              <Field field={{ name: "password_confirmation", label: "Confirm password", type: "password" }} value={password.password_confirmation} onChange={(v) => setPassword((p) => ({ ...p, password_confirmation: v }))} />
            </div>
            <button
              onClick={savePassword}
              disabled={savingPassword || !password.current_password || !password.password}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {savingPassword ? <Spinner className="text-white" /> : <KeyRound className="h-4 w-4" />} Update password
            </button>
          </SectionCard>
        </div>

        <div>
          <SectionCard
            title="Active sessions"
            actions={
              <button onClick={logoutAll} className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:underline">
                <LogOut className="h-3.5 w-3.5" /> Sign out all
              </button>
            }
          >
            <ul className="space-y-2">
              {sessions.map((s) => (
                <li key={s.id} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium capitalize">{s.name}</p>
                      <p className="text-xs text-gray-400">
                        {s.is_current ? "This device" : s.last_used_at ? new Date(s.last_used_at).toLocaleDateString() : "—"}
                      </p>
                    </div>
                  </div>
                  {!s.is_current && (
                    <button onClick={() => revoke(s.id)} className="text-xs font-medium text-red-600 hover:underline">
                      Revoke
                    </button>
                  )}
                </li>
              ))}
              {sessions.length === 0 && <p className="text-sm text-gray-400">No active sessions.</p>}
            </ul>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
