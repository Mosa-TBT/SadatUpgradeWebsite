"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  GripVertical,
  Pencil,
  Trash2,
  ChevronRight,
  CornerDownRight,
  ArrowLeftFromLine,
  Save,
} from "lucide-react";
import { api } from "@/lib/admin/api";
import { useAdminAuth } from "@/components/admin/auth-provider";
import { useToast } from "@/components/admin/toast";
import { PageHeader, Modal, ConfirmDialog, Spinner, EmptyState } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import type { ApiEnvelope, Paginated } from "@/types";

interface MenuPage {
  id: number;
  title: string;
}

interface RawMenuItem {
  id: number;
  label: string;
  type: string;
  url?: string | null;
  page_id?: number | string | null;
  target?: string | null;
  icon?: string | null;
  visibility?: string | null;
  is_active?: boolean;
  resolved_url?: string;
  children?: RawMenuItem[];
}

interface FlatItem extends RawMenuItem {
  level: number;
}

interface Menu {
  id: number;
  name: string;
  location: string;
  items: RawMenuItem[];
}

interface ItemForm {
  label: string;
  type: string;
  url: string;
  page_id: string | number;
  target: string;
  icon: string;
  visibility: string;
  is_active: boolean;
  parent_id?: number | null;
}

interface ConfirmState {
  item?: FlatItem;
  menu?: Menu;
}

const EMPTY_ITEM: ItemForm = {
  label: "",
  type: "internal",
  url: "",
  page_id: "",
  target: "_self",
  icon: "",
  visibility: "always",
  is_active: true,
};

export default function NavigationPage() {
  const { can } = useAdminAuth();
  const toast = useToast();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [pages, setPages] = useState<MenuPage[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [flat, setFlat] = useState<FlatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [menuModal, setMenuModal] = useState(false);
  const [menuForm, setMenuForm] = useState({ name: "", location: "header" });
  const [itemModal, setItemModal] = useState(false);
  const [itemForm, setItemForm] = useState<ItemForm>(EMPTY_ITEM);
  const [editingItem, setEditingItem] = useState<FlatItem | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const load = useCallback(
    async (menuId?: number) => {
      setLoading(true);
      try {
        const res = await api.get<ApiEnvelope<Menu[]>>("/admin/menus");
        const list = res.data || [];
        setMenus(list);
        const target = list.find((m) => m.id === menuId) || list[0];
        if (target) {
          setActiveMenuId(target.id);
          setFlat(flatten(target.items));
        } else {
          setActiveMenuId(null);
          setFlat([]);
        }
      } catch (e) {
        toast.error(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    load();
    api
      .get<ApiEnvelope<Paginated<MenuPage>>>("/admin/pages?per_page=100")
      .then((res) => setPages(res.data.data || []))
      .catch(() => {});
  }, [load]);

  const activeMenu = useMemo(() => menus.find((m) => m.id === activeMenuId), [menus, activeMenuId]);

  const switchMenu = (id: number) => {
    const menu = menus.find((m) => m.id === id);
    setActiveMenuId(id);
    setFlat(menu ? flatten(menu.items) : []);
  };

  const createMenu = async () => {
    try {
      await api.post("/admin/menus", menuForm);
      toast.success("Menu created");
      setMenuModal(false);
      setMenuForm({ name: "", location: "header" });
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  };

  const deleteMenu = async () => {
    try {
      await api.del(`/admin/menus/${activeMenuId}`);
      toast.success("Menu deleted");
      setConfirm(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  };

  const openAddItem = (parentId: number | null = null) => {
    setEditingItem(null);
    setItemForm({ ...EMPTY_ITEM, parent_id: parentId });
    setItemModal(true);
  };

  const openEditItem = (item: FlatItem) => {
    setEditingItem(item);
    setItemForm({
      label: item.label,
      type: item.type,
      url: item.url || "",
      page_id: item.page_id || "",
      target: item.target || "_self",
      icon: item.icon || "",
      visibility: item.visibility || "always",
      is_active: !!item.is_active,
    });
    setItemModal(true);
  };

  const saveItem = async () => {
    try {
      const payload = { ...itemForm, page_id: itemForm.page_id || null };
      if (editingItem) await api.put(`/admin/menus/${activeMenuId}/items/${editingItem.id}`, payload);
      else await api.post(`/admin/menus/${activeMenuId}/items`, payload);
      toast.success("Menu item saved");
      setItemModal(false);
      if (activeMenuId != null) load(activeMenuId);
      else load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  };

  const deleteItem = async () => {
    try {
      await api.del(`/admin/menus/${activeMenuId}/items/${confirm?.item?.id}`);
      toast.success("Menu item removed");
      setConfirm(null);
      if (activeMenuId != null) load(activeMenuId);
      else load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  };

  const changeLevel = (index: number, delta: number) => {
    setFlat((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, level: Math.max(0, Math.min(item.level + delta, maxLevel(prev, index))) } : item,
      ),
    );
  };

  const onDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    setFlat((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(null);
  };

  const saveOrder = async () => {
    setSaving(true);
    try {
      const stack: (number | undefined)[] = [];
      const payload = flat.map((item, index) => {
        stack[item.level] = item.id;
        stack.length = item.level + 1;
        const parent_id = item.level > 0 ? stack[item.level - 1] : null;
        return { id: item.id, parent_id, sort_order: index };
      });
      await api.post(`/admin/menus/${activeMenuId}/reorder`, { items: payload });
      toast.success("Navigation order saved");
      if (activeMenuId != null) load(activeMenuId);
      else load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Navigation"
        description="Build header and footer menus. Drag to reorder, nest items, and save."
        actions={
          <>
            {can("navigation.update") && activeMenu && (
              <button
                onClick={saveOrder}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {saving ? <Spinner className="text-white" /> : <Save className="h-4 w-4" />} Save order
              </button>
            )}
            {can("navigation.update") && (
              <button
                onClick={() => setMenuModal(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" /> Menu
              </button>
            )}
          </>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {menus.map((menu) => (
          <button
            key={menu.id}
            onClick={() => switchMenu(menu.id)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm font-medium capitalize transition",
              menu.id === activeMenuId
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 text-gray-600 hover:bg-gray-50",
            )}
          >
            {menu.name}
            <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] uppercase text-gray-500">
              {menu.location}
            </span>
          </button>
        ))}
        {menus.length === 0 && !loading && <span className="text-sm text-gray-400">No menus yet.</span>}
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner className="h-7 w-7" />
        </div>
      ) : flat.length === 0 ? (
        <EmptyState
          title="No menu items"
          description="Add your first navigation item."
          action={
            can("navigation.update") && (
              <button onClick={() => openAddItem()} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Add item
              </button>
            )
          }
        />
      ) : (
        <div className="space-y-2">
          {flat.map((item, index) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(index)}
              style={{ marginLeft: item.level * 28 }}
              className={cn(
                "group flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2.5 shadow-sm transition",
                dragIndex === index && "opacity-50",
              )}
            >
              <GripVertical className="h-4 w-4 cursor-grab text-gray-300" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {item.label}
                  {item.level > 0 && <CornerDownRight className="ml-1 inline h-3.5 w-3.5 text-gray-300" />}
                </p>
                <p className="text-xs text-gray-400">{item.resolved_url}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                {can("navigation.update") && (
                  <>
                    <button onClick={() => changeLevel(index, 1)} title="Indent" className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <button onClick={() => changeLevel(index, -1)} title="Outdent" className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600">
                      <ArrowLeftFromLine className="h-4 w-4" />
                    </button>
                    <button onClick={() => openAddItem(item.id)} title="Add child" className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-emerald-600">
                      <Plus className="h-4 w-4" />
                    </button>
                    <button onClick={() => openEditItem(item)} title="Edit" className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setConfirm({ item })} title="Delete" className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
          {can("navigation.update") && (
            <button
              onClick={() => openAddItem()}
              className="mt-2 inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600"
            >
              <Plus className="h-4 w-4" /> Add item
            </button>
          )}
        </div>
      )}

      {activeMenu && can("navigation.update") && (
        <button onClick={() => setConfirm({ menu: activeMenu })} className="mt-8 text-sm text-red-600 hover:underline">
          Delete this menu
        </button>
      )}

      <Modal
        open={menuModal}
        onClose={() => setMenuModal(false)}
        title="New menu"
        size="sm"
        footer={
          <>
            <button onClick={() => setMenuModal(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={createMenu} disabled={!menuForm.name} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">Create</button>
          </>
        }
      >
        <div className="space-y-3">
          <input value={menuForm.name} onChange={(e) => setMenuForm((p) => ({ ...p, name: e.target.value }))} placeholder="Menu name" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          <select value={menuForm.location} onChange={(e) => setMenuForm((p) => ({ ...p, location: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
            <option value="header">Header</option>
            <option value="footer">Footer</option>
            <option value="sidebar">Sidebar</option>
            <option value="mobile">Mobile</option>
          </select>
        </div>
      </Modal>

      <Modal
        open={itemModal}
        onClose={() => setItemModal(false)}
        title={editingItem ? "Edit menu item" : "Add menu item"}
        size="md"
        footer={
          <>
            <button onClick={() => setItemModal(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={saveItem} disabled={!itemForm.label} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">Save</button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Label</label>
            <input value={itemForm.label} onChange={(e) => setItemForm((p) => ({ ...p, label: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Type</label>
            <select value={itemForm.type} onChange={(e) => setItemForm((p) => ({ ...p, type: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
              <option value="internal">Internal URL</option>
              <option value="external">External URL</option>
              <option value="page">Page</option>
            </select>
          </div>
          {itemForm.type === "page" ? (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Page</label>
              <select value={itemForm.page_id || ""} onChange={(e) => setItemForm((p) => ({ ...p, page_id: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                <option value="">— Select page —</option>
                {pages.map((pg) => (
                  <option key={pg.id} value={pg.id}>{pg.title}</option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">URL</label>
              <input value={itemForm.url} onChange={(e) => setItemForm((p) => ({ ...p, url: e.target.value }))} placeholder="/services" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Target</label>
            <select value={itemForm.target} onChange={(e) => setItemForm((p) => ({ ...p, target: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
              <option value="_self">Same tab</option>
              <option value="_blank">New tab</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Visibility</label>
            <select value={itemForm.visibility} onChange={(e) => setItemForm((p) => ({ ...p, visibility: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
              <option value="always">Always</option>
              <option value="authenticated">Logged in</option>
              <option value="guest">Logged out</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Icon</label>
            <input value={itemForm.icon} onChange={(e) => setItemForm((p) => ({ ...p, icon: e.target.value }))} placeholder="lucide icon name" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={itemForm.is_active} onChange={(e) => setItemForm((p) => ({ ...p, is_active: e.target.checked }))} className="h-4 w-4 rounded border-gray-300" />
            Active
          </label>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={confirm?.item ? deleteItem : confirm?.menu ? deleteMenu : () => {}}
        title={confirm?.item ? "Delete item" : "Delete menu"}
        description={confirm?.item ? `Remove "${confirm.item.label}" from this menu?` : `Delete the "${confirm?.menu?.name}" menu and all its items?`}
        confirmLabel="Delete"
      />
    </div>
  );
}

function flatten(items?: RawMenuItem[], level = 0, out: FlatItem[] = []): FlatItem[] {
  (items || []).forEach((item) => {
    out.push({ ...item, level });
    flatten(item.children, level + 1, out);
  });
  return out;
}

function maxLevel(flat: FlatItem[], index: number): number {
  if (index === 0) return 0;
  return Math.min(flat[index - 1].level + 1, 3);
}
