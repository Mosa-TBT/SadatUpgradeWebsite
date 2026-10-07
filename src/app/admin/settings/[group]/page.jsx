import { SettingsForm } from "@/components/admin/settings-form";

const GROUPS = {
  general: { title: "General Settings", description: "Core site identity and contact details." },
  website: { title: "Website Settings", description: "Maintenance mode, registration and pagination." },
  security: { title: "Security Settings", description: "Sessions, login limits and password policy." },
  email: { title: "Email Settings", description: "SMTP configuration. Secrets are encrypted at rest." },
  storage: { title: "Storage Settings", description: "Upload limits, allowed file types and thumbnails." },
  social: { title: "Social Settings", description: "Social media links shown across the website." },
  seo: { title: "SEO Settings", description: "Default metadata, Open Graph and robots." },
  api: { title: "API Settings", description: "API availability and rate limiting." },
  localization: { title: "Localization Settings", description: "Language and RTL behaviour." },
  backup: { title: "Backup Settings", description: "Backup schedule and retention policy." },
};

export function generateStaticParams() {
  return Object.keys(GROUPS).map((group) => ({ group }));
}

export default async function SettingsGroupPage({ params }) {
  const { group } = await params;
  const meta = GROUPS[group];

  if (!meta) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
        Unknown settings group.
      </div>
    );
  }

  return <SettingsForm group={group} title={meta.title} description={meta.description} />;
}
