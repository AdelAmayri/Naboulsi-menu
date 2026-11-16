# NABOULSI Digital Menu

Premium bilingual (English / Arabic) digital menu for NABOULSI Resto Cafe.

## Stack
- Next.js 16.4.6 + React 19 + TypeScript
- Tailwind CSS 4
- Motion for React
- Supabase Postgres + Data API

## Setup
1. Install Node.js 22 and npm.
2. Copy `.env.example` to `.env.local`.
3. Keep the provided Supabase URL and publishable key; set the restaurant WhatsApp number in international format without spaces or a leading plus sign (Lebanon: 961...).
4. Run `npm install`, then `npm run dev`.

## Environment
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`

The publishable key is designed for frontend use. Never put a Supabase service-role or secret key in a `NEXT_PUBLIC_*` variable.

## Supabase schema
Migration `supabase/migrations/20261116112049_initial_menu_schema.sql` has been applied to the dedicated `NABOULSI-Menu` project.
- `menu_categories`: 12 bilingual categories, already seeded.
- `menu_products`: empty by design; no dishes, photos, or prices have been invented.
- `site_settings`: brand and ordering settings.
- RLS is enabled on every public table. Public clients have read-only grants and policies.

## Current implementation
- Premium responsive hero and editorial layout.
- English / Arabic language switch and RTL layout.
- Categories are loaded from Supabase.
- Product cards are ready for real catalog data.
- Cart totals and WhatsApp order message are implemented.
- WhatsApp checkout remains inactive until the restaurant's real number is entered.

## Verification
A GitHub Actions workflow runs install, lint, TypeScript checks, and production build on pushes to `main`.
