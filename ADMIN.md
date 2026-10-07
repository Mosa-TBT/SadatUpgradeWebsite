# Sadat Upgrade — Admin Panel Guide

The admin panel is a Next.js application served inside the same project at
**`/admin`**. It is backed by the Laravel API in `backend/`.

## Quick start

1. Start MySQL/MariaDB on port `4306` (XAMPP instance).
2. Start the backend:

   ```bash
   cd backend
   php artisan migrate --seed
   php artisan serve --port=8000
   ```

3. Start the frontend:

   ```bash
   npm install
   npm run dev
   # visit http://localhost:3000/admin
   ```

4. Sign in with the **admin seeded account** (`admin@sadatupgrade.com`). The password is
   taken from `ADMIN_PASSWORD` at seed time; if unset, a random one-time password is
   printed by the seeder (`php artisan migrate --seed`). Never commit real credentials.
   The `editor@sadatupgrade.com` account (`EDITOR_PASSWORD`) demonstrates RBAC limits.

## What you can do

| Area            | What it controls                                                          |
|-----------------|--------------------------------------------------------------------------|
| Dashboard       | Reorderable, hideable widgets; date ranges; traffic & activity feeds.    |
| Theme           | Live-preview design token editor — colors, typography, layout, dark mode; presets, duplicate, versions, publish. |
| Navigation      | Header/footer menus with drag ordering, nesting, external links, pages.  |
| Pages           | Full page builder with reusable blocks (hero, cards, FAQ, CTA, gallery…) + SEO + revisions. |
| Content         | Services, Projects, Posts (categories/tags), Testimonials, Team, FAQs, Pricing, Careers. |
| Media           | Central media library with uploads, thumbnails, search, copy-URL, bulk delete. |
| Users & roles   | User CRUD, status, verify, reset password, role assignment; permission matrix per role. |
| SEO             | Global defaults, Open Graph, robots, per-page SEO, dynamic sitemap.      |
| Localization    | Languages (incl. RTL), translation strings.                              |
| Settings        | General, website, security, email (encrypted), storage, social, API, backup. |
| System          | Environment info, maintenance mode, cache operations, audit & login logs.|
| Profile         | Own profile, password, active sessions, sign-out everywhere.             |

## How the site consumes the configuration

Create/activate a theme or change the site name in the panel and the **public
website picks it up automatically**:

- `ConfigProvider` (in `src/components/site-chrome.jsx`) loads
  `/api/public/config` and applies the design tokens as CSS variables
  (`--color-*`, the shadcn HSL tokens, `--radius`, fonts) to `:root`.
- Navigation is rendered from `/api/public/menus` (with hardcoded fallbacks).
- Brand/contact/socials come from public settings (with fallbacks).
- Page views are tracked to `/api/public/page-views`.

This keeps the existing site intact while making it configuration-driven.

## Extending

See `backend/docs/ARCHITECTURE.md` for backend extension points.
Frontend conventions:

- API client: `src/lib/admin/api.js`.
- Auth: `src/components/admin/auth-provider.jsx` (permissions available via `can()`).
- Simple CRUD: build pages on `ResourceManager` (`src/components/admin/resource-manager.jsx`).
- Sidebar nav: edit `src/lib/admin/nav.js`.

The backend URL can be changed via `NEXT_PUBLIC_API_URL` (default
`http://127.0.0.1:8000/api`).