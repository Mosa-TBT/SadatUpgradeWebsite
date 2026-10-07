"use client";

import { ResourceManager } from "@/components/admin/resource-manager";
import { StatusBadge } from "@/components/admin/ui";

export default function PricingPage() {
  return (
    <ResourceManager
      title="Pricing Plan"
      description="Pricing tiers displayed on the pricing page."
      endpoint="/admin/pricing-plans"
      permissions={{ create: "content.create", update: "content.update", delete: "content.delete" }}
      togglable
      columns={[
        { key: "name", label: "Name", render: (r) => <span className="font-medium text-gray-900">{r.name}</span> },
        { key: "price", label: "Price", render: (r) => `${r.currency} ${Number(r.price).toLocaleString()}` },
        { key: "is_popular", label: "Popular", render: (r) => (r.is_popular ? "Yes" : "—") },
        { key: "is_active", label: "Status", render: (r) => <StatusBadge status={r.is_active ? "active" : "inactive"} /> },
      ]}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "price", label: "Price", type: "number", required: true },
        { name: "currency", label: "Currency", type: "text" },
        { name: "period", label: "Period", type: "text" },
        { name: "description", label: "Description", type: "textarea", wide: true },
        { name: "features", label: "Features", type: "tags", wide: true },
        { name: "cta_label", label: "Button label", type: "text" },
        { name: "cta_url", label: "Button URL", type: "url" },
        { name: "delivery_time", label: "Delivery time", type: "text" },
        { name: "is_popular", label: "Popular", type: "boolean" },
        { name: "is_active", label: "Active", type: "boolean" },
        { name: "sort_order", label: "Sort order", type: "number" },
      ]}
      defaultValues={{ currency: "USD", period: "project", is_active: true, sort_order: 0, features: [], cta_label: "Get Started" }}
    />
  );
}
