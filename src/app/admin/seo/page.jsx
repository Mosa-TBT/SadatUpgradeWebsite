import { SettingsForm } from "@/components/admin/settings-form";

export default function SeoPage() {
  return (
    <SettingsForm
      group="seo"
      title="SEO Settings"
      description="Control default metadata, Open Graph, Twitter cards and robots directives."
    />
  );
}
