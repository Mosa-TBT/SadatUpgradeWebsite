# Sadat Upgrade — Admin & CMS Backend Architecture

This document explains the Laravel backend that powers the admin panel and the
public website configuration system.

## Stack

| Layer      | Technology                                |
|------------|--------------------------------------------|
| Backend    | Laravel 12 (PHP 8.2+)                      |
| Database   | MySQL / MariaDB (default `sadat_admin`)    |
| Auth       | Laravel Sanctum personal access tokens     |
| Frontend   | Next.js 15 (App Router) at `/admin`        |

The backend is an **API-only** application. There is no blade UI. Everything an
administrator sees is a Next.js client page that talks to the JSON API under
`/api`.

## Folder layout

```
app/
  Http/Controllers/Api/
    PublicController.php        # unauthenticated website API
    Admin/...                   # authenticated admin controllers
  Http/Middleware/              # permission + active-user + JSON middleware
  Http/Traits/ApiResponse.php   # consistent JSON envelope helpers
  Models/                       # Eloquent models
  Models/Concerns/              # HasRoles, HasSlug, Auditable
  Policies/                     # per-model authorization policies (RBAC)
  Providers/AppServiceProvider  # gate wiring + rate limiter
  Support/                      # services & registries (see below)
database/
  migrations/                   # schema (see below)
  seeders/                      # roles, permissions, settings, themes, content
routes/api.php                  # all API routes
bootstrap/app.php               # middleware + JSON exception rendering
```

## Database schema

| Table                   | Purpose                                        |
|-------------------------|------------------------------------------------|
| `users`                 | Admin + website users (SoftDeletes)            |
| `roles` / `permissions` | RBAC entities                                  |
| `permission_role` / `role_user` | many-to-many pivots                    |
| `settings`              | key/value site settings (groups, encryption)   |
| `themes` / `theme_versions` | design-token themes + version history      |
| `menus` / `menu_items`  | database-driven navigation (nested)            |
| `pages` / `page_sections` / `page_revisions` | pages, blocks, snapshots |
| `media`                 | unified media library (metadata + thumbnails)  |
| `audit_logs`            | searchable administrative audit trail          |
| `login_activities`      | successful / failed logins                     |
| `services` `projects` `posts` `post_categories` `tags` `testimonials` `team_members` `faqs` `pricing_plans` `job_openings` | CMS collections |
| `contact_messages` `newsletter_subscribers` | inbound site submissions |
| `languages` `translations` | localization                              |
| `page_views`            | lightweight public traffic tracking            |
| `personal_access_tokens`| Sanctum tokens (also drive "sessions")        |

Foreign keys, unique constraints and indexes live inside each migration.

## Authentication

- `POST /api/auth/login` → returns a Sanctum **Bearer token**. Rate limited and
  audited. Failed attempts are recorded in `login_activities`.
- All `/api/admin/*` routes require `auth:sanctum` + the `active` middleware
  (a `suspended` user is rejected and their tokens revoked).
- `POST /api/auth/logout`, `/auth/me`, `/auth/change-password`,
  `/auth/sessions` and endpoint-level revocation are provided.

## RBAC

- **Permissions** are granular slugs: `users.view`, `pages.publish`,
  `theme.publish`, `logs.view`, … (seeded in `RbacSeeder`).
- **Roles** are granted permission sets. `super-admin` (and any user with
  `is_super_admin = true`) bypass all checks via `Gate::before`.
- Enforcement happens in three layers:
  1. Route middleware: `permission:users.view` returns `403` JSON.
  2. Policies: `UserPolicy`, `PagePolicy`, `ThemePolicy`, … used by controllers
     via `$this->authorize()`.
  3. Authorized controllers never trust the frontend; every mutating endpoint
     performs server-side validation (`FormRequest`/inline rules).

## Settings system

- Every setting is defined in `app/Support/SettingsRegistry.php`:
  `group → key → [type, default, public, encrypted, label, options]`.
- `SettingService` caches all settings, casts on read, encrypts sensitive
  values (e.g. SMTP password) and flushes caches on write.
- The **public config API** (`/api/public/config`) exposes only settings marked
  `public` plus the active theme tokens, so the frontend can theme itself
  without exposing secrets.
- The admin settings UI renders directly from the registry, so new settings
  appear automatically.

## Theme system

- A theme is a JSON document of **design tokens**
  (`colors`, `dark`, `typography`, `layout`, `dark_mode`). See
  `ThemeService::defaults()`.
- `ThemeService` merges the active theme over canonical defaults and caches the
  result. `Theme` records create `theme_versions` snapshots on publish.
- Flow: edit (draft) → **Save changes** → **Publish** (creates a version and
  marks the theme active) → revert any time via version history.

## API structure

- **Public** `/api/public/*` — website data (config, menus, pages, collections,
  contact/newsletter submission, page-view tracking, `/sitemap.xml`).
- **Auth** `/api/auth/*` — login/register/password/sessions.
- **Admin** `/api/admin/*` — everything else, all authenticated & authorized.

Response envelope: `{ success, message, data }`. Paginated lists use Laravel's
default `current_page / last_page / total / data` shape.

## How to add a new setting

1. In `SettingsRegistry::all()` add `group => [ 'key' => ['type'=>..., 'default'=>...] ]`.
2. Optional: set `public => true` to expose it on `/api/public/config`.
3. Optional: set `encrypted => true` for secrets.
4. Optional: `options => [...]` for select fields.
No other code is required — the UI and seeder read the registry.

## How to add a new theme token

1. Add the token to `ThemeService::defaults()` under the appropriate section.
2. Any theme whose `tokens` omit it automatically falls back to the default.
3. Optionally add a control to the admin Theme customizer
   (`src/app/admin/theme/page.jsx`) in the matching tab.

## How to add a new page block

1. Register the block in `App\Support\BlockRegistry::all()` with
   `label`, `icon`, and `fields` (including `repeater`/`item_fields`).
2. The admin page builder renders the block form automatically.
3. Render the block on the public site (the page sections are available via
   `/api/public/pages/{slug}`).

## How to add a new permission

1. Add it to `RbacSeeder::permissions()` under the right group.
2. Re-run `php artisan db:seed --class=RbacSeeder` and assign it to a role.
3. Guard a route with `->middleware('permission:module.action')` (must start
   with `module.` to match the seeder group).

## How to add a new admin module

1. Create `app/Http/Controllers/Api/Admin/YourController.php`.
2. Add routes in `routes/api.php` under the `admin` group with permissions.
3. Register the permission in `RbacSeeder`.
4. Add the sidebar item in `src/lib/admin/nav.js` (client).
5. Create `src/app/admin/<module>/page.jsx` — for simple CRUD extend
   `ResourceManager`; for custom UIs build the page directly and call the API
   through `src/lib/admin/api.js`.

## Security checklist

- Passwords: `Hash`/`hashed` cast only. Sanctum for tokens.
- CSRF: not needed for Bearer-token APIs; kept for any future cookie sessions.
- Input: validated; unknown settings keys ignored; uploads whitelisted by MIME
  + extension and size-limited.
- Secrets: `mail_password` etc. encrypted at rest; `.env` gitignored; debug
  shows JSON errors only.
- Audit: every sensitive action writes an `audit_logs` row with old/new values,
  IP and user agent.

## Running

```bash
composer install
copy .env.example .env   # set DB creds (default: 127.0.0.1:4306, sadat_admin)
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve --port=8000
```

Seed users (passwords come from `ADMIN_PASSWORD` / `EDITOR_PASSWORD` envs or are
random one-time values printed by the seeder — never a committed default):
- `admin@sadatupgrade.com` (super admin)
- `editor@sadatupgrade.com` (editor, limited RBAC)

Run tests:

```bash
php artisan test
```