import {
  LayoutDashboard,
  FileText,
  Newspaper,
  Briefcase,
  FolderKanban,
  Quote,
  Users2,
  HelpCircle,
  DollarSign,
  BadgeCheck,
  Palette,
  Navigation,
  Image as ImageIcon,
  Users,
  ShieldCheck,
  Globe,
  Languages,
  Mail,
  Send,
  MessageSquare,
  Settings,
  Database,
  ScrollText,
  Activity,
  Search,
  PanelTop,
  Server,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AdminNavItem {
  label: string;
  icon?: LucideIcon;
  permission: string;
  href?: string;
  exact?: boolean;
  children?: AdminNavItem[];
}

export const adminNav: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, permission: "dashboard.view", exact: true },
  {
    label: "Content",
    icon: PanelTop,
    permission: "content.view",
    children: [
      { label: "Pages", href: "/admin/pages", icon: FileText, permission: "pages.view" },
      { label: "Posts", href: "/admin/posts", icon: Newspaper, permission: "posts.view" },
      { label: "Services", href: "/admin/services", icon: Briefcase, permission: "content.view" },
      { label: "Projects", href: "/admin/projects", icon: FolderKanban, permission: "content.view" },
      { label: "Testimonials", href: "/admin/testimonials", icon: Quote, permission: "content.view" },
      { label: "Team", href: "/admin/team", icon: Users2, permission: "content.view" },
      { label: "FAQs", href: "/admin/faqs", icon: HelpCircle, permission: "content.view" },
      { label: "Pricing", href: "/admin/pricing", icon: DollarSign, permission: "content.view" },
      { label: "Careers", href: "/admin/jobs", icon: BadgeCheck, permission: "content.view" },
    ],
  },
  {
    label: "Appearance",
    icon: Palette,
    permission: "theme.view",
    children: [
      { label: "Theme", href: "/admin/theme", icon: Palette, permission: "theme.view" },
      { label: "Navigation", href: "/admin/navigation", icon: Navigation, permission: "navigation.view" },
    ],
  },
  { label: "Media", href: "/admin/media", icon: ImageIcon, permission: "media.view" },
  {
    label: "Users",
    icon: Users,
    permission: "users.view",
    children: [
      { label: "Users", href: "/admin/users", icon: Users, permission: "users.view" },
      { label: "Roles & Permissions", href: "/admin/roles", icon: ShieldCheck, permission: "roles.view" },
    ],
  },
  {
    label: "SEO",
    icon: Search,
    permission: "settings.view",
    children: [
      { label: "Global SEO", href: "/admin/seo", icon: Globe, permission: "settings.view" },
      { label: "Sitemap", href: "/admin/sitemap", icon: Navigation, permission: "settings.view" },
    ],
  },
  {
    label: "Localization",
    icon: Languages,
    permission: "localization.view",
    children: [
      { label: "Languages", href: "/admin/languages", icon: Languages, permission: "localization.view" },
      { label: "Translations", href: "/admin/translations", icon: Languages, permission: "localization.view" },
    ],
  },
  {
    label: "Messages",
    icon: Mail,
    permission: "messages.view",
    children: [
      { label: "Contact", href: "/admin/messages", icon: Mail, permission: "messages.view" },
      { label: "Newsletter", href: "/admin/newsletter", icon: Send, permission: "messages.view" },
      { label: "Live Chat", href: "/admin/chat", icon: MessageSquare, permission: "messages.view" },
    ],
  },
  {
    label: "Settings",
    icon: Settings,
    permission: "settings.view",
    children: [
      { label: "General", href: "/admin/settings/general", permission: "settings.view" },
      { label: "Website", href: "/admin/settings/website", permission: "settings.view" },
      { label: "Security", href: "/admin/settings/security", permission: "settings.view" },
      { label: "Email", href: "/admin/settings/email", permission: "settings.view" },
      { label: "Storage", href: "/admin/settings/storage", permission: "settings.view" },
      { label: "Social", href: "/admin/settings/social", permission: "settings.view" },
      { label: "API", href: "/admin/settings/api", permission: "settings.view" },
      { label: "Backup", href: "/admin/settings/backup", permission: "settings.view" },
    ],
  },
  {
    label: "System",
    icon: Server,
    permission: "logs.view",
    children: [
      { label: "Activity Logs", href: "/admin/logs", icon: ScrollText, permission: "logs.view" },
      { label: "Login Activity", href: "/admin/logins", icon: Activity, permission: "logs.view" },
      { label: "System Information", href: "/admin/system", icon: Database, permission: "system.view" },
    ],
  },
];
