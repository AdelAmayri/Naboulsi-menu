# NABOULSI Digital Menu

Premium bilingual (English / Arabic) digital menu for NABOULSI Resto Cafe.

## Stack
- Next.js 16 + React + TypeScript
- Tailwind CSS 4
- Motion for React
- Supabase (Postgres + Data API)

## Setup
1. Install Node.js 22.12+ and pnpm.
2. Copy `.env.example` to `.env.local`.
3. Add the Supabase publishable key from the NABOULSI-Menu project.
4. Run `pnpm install`, then `pnpm dev`.

## Environment
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`

Only the Supabase publishable key belongs in the browser. Never place a service-role or secret key in a `NEXT_PUBLIC_*` variable.

## Current build status
The first visual foundation is in place: bilingual hero, category navigation, responsive layout, and motion effects. The menu catalog is intentionally not populated with invented dishes or prices. The next implementation stage connects the live category/product tables and the WhatsApp cart flow.
