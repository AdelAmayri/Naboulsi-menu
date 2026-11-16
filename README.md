# NABOULSI Digital Menu

Premium bilingual (English / Arabic) digital menu for NABOULSI Resto Cafe.

## Stack
- Next.js 16.4.6 + React 19 + TypeScript
- Tailwind CSS 4
- Motion for React
- Supabase Postgres + Data API

## Restaurant ordering
- WhatsApp orders are directed to the confirmed restaurant number: +961 81 461 333.
- Runtime environment variable: `NEXT_PUBLIC_WHATSAPP_NUMBER=96181461333`.
- The app also has a source fallback to this confirmed number if the environment variable is missing or left as a placeholder.

## Setup
1. Install Node.js 22 and npm.
2. Copy `.env.example` to `.env.local`.
3. Keep the Supabase URL and publishable key; confirm the WhatsApp number is `96181461333`.
4. Run `npm install`, then `npm run dev`.

## Environment
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`

The publishable key is designed for frontend use. Never put a Supabase service-role or secret key in a `NEXT_PUBLIC_*` variable.

## Supabase menu data
The dedicated `NABOULSI-Menu` Supabase project currently contains:
- `menu_categories`: 27 bilingual categories.
- `menu_products`: 101 products already entered.
- `site_settings`: 2 settings records.
- Row Level Security is enabled on the public menu tables; public access is read-only.

Products are currently populated in these sections: Appetizers (19), Breakfast (13), Salad (10), Pizza (10), Pasta (10), Burgers (16), Sandwiches (12), Diet Sandwiches & Meals (5), and Shawarma (6). Other categories are present and ready for their menu items.

## Current implementation
- Premium responsive hero and editorial layout.
- English / Arabic language switch and RTL layout.
- Categories and products are loaded from Supabase.
- Product cards, cart totals, and WhatsApp order message are implemented.
- Restaurant WhatsApp contact is configured in source and the example environment file.

## Verification
GitHub Actions runs dependency installation, lint, TypeScript checks, and a production build on pushes to `main`.
