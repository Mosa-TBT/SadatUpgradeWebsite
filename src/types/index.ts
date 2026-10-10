/**
 * Domain & API types shared across the public frontend and admin.
 * Mirror the Laravel API responses (App\Http\Resources + public endpoints).
 */

export interface ApiEnvelope<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]> | null;
}

export interface Paginated<T> {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
  data: T[];
}

export interface Media {
  id: number;
  disk?: string;
  folder?: string;
  path?: string;
  filename?: string;
  original_name?: string;
  mime_type?: string;
  extension?: string | null;
  size?: number;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
  title?: string | null;
  url: string;
  thumbnail_url?: string | null;
  is_image?: boolean;
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  icon?: string | null;
  short_description?: string | null;
  description?: string | null;
  features?: string[] | null;
  technologies?: string[] | null;
  image_url?: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  category?: string | null;
  client_name?: string | null;
  short_description?: string | null;
  description?: string | null;
  duration?: string | null;
  team_size?: number | null;
  image_url?: string | null;
  technologies?: string[] | null;
  results?: string[] | null;
  challenges?: string[] | null;
  solutions?: string[] | null;
  testimonial_content?: string | null;
  testimonial_author?: string | null;
  testimonial_role?: string | null;
  live_url?: string | null;
  repo_url?: string | null;
  status: string;
  is_active: boolean;
  is_featured?: boolean;
  sort_order: number;
}

export interface Testimonial {
  id: number;
  name: string;
  role?: string | null;
  content: string;
  rating?: number;
  avatar_url?: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface TeamMember {
  id: number;
  name: string;
  role?: string | null;
  position?: string | null;
  department?: string | null;
  bio?: string | null;
  socials?: Record<string, string> | null;
  portfolio_url?: string | null;
  image_url?: string | null;
  sort_order: number;
  status: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  image_url?: string | null;
  status: string;
  published_at?: string | null;
  created_at?: string | null;
  read_time?: number | null;
  is_featured?: boolean;
  category?: Category | null;
  author?: { id: number; name: string } | null;
  tags?: Tag[] | string[] | null;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  category?: string | null;
  sort_order: number;
  is_active?: boolean;
}

export interface PricingPlan {
  id: number;
  name: string;
  price?: number | string;
  currency?: string;
  period?: string | null;
  description?: string | null;
  features?: string[] | null;
  cta_label?: string | null;
  cta_url?: string | null;
  delivery_time?: string | null;
  is_popular?: boolean;
  is_active?: boolean;
  sort_order?: number;
}

export interface JobOpening {
  id: number;
  title: string;
  slug: string;
  department?: string | null;
  location?: string | null;
  type?: string | null;
  salary?: string | null;
  description?: string | null;
  requirements?: string[] | null;
  status: string;
  posted_at?: string | null;
  created_at?: string | null;
  sort_order?: number;
}

export interface NavItem {
  id: number;
  label: string;
  url: string;
  target?: string;
  icon?: string | null;
  children: NavItem[];
}

export interface PublicMenus {
  header?: NavItem[];
  footer?: NavItem[];
  [key: string]: NavItem[] | undefined;
}

export interface ThemeTokens {
  colors: Record<string, string>;
  dark: Record<string, string>;
  dark_mode: { enabled: boolean; auto: boolean };
  typography: Record<string, string>;
  layout: Record<string, string>;
}

export interface Language {
  code: string;
  name: string;
  native_name: string;
  direction: "ltr" | "rtl";
  is_default?: boolean;
}

export interface PublicConfig {
  settings: Record<string, Record<string, unknown>>;
  theme: ThemeTokens;
  languages: Language[];
  maintenance: { enabled: boolean; message?: string | null };
}

export interface Branding {
  logoLight?: string | null;
  logoDark?: string | null;
  logoIcon?: string | null;
  favicon?: string | null;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  is_super_admin?: boolean;
  permissions?: string[];
  avatar_url?: string | null;
  [key: string]: unknown;
}