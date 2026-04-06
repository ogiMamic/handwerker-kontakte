# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

German-language craftsman (Handwerker) marketplace connecting clients with tradespeople. Built with Next.js 14 App Router, deployed on Vercel. The UI and domain language is primarily German.

## Commands

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run lint` — ESLint (note: ESLint and TypeScript errors are ignored during builds via next.config.mjs)
- `npm run db:migrate` — run SQL migrations (`tsx scripts/migrate-db.ts`)
- `npm run db:seed` — seed database (`tsx scripts/seed-db.ts`)
- `vercel --prod` — deploy to production

## Architecture

### Routing & i18n

- App Router with `[lang]` dynamic segment — all pages live under `app/[lang]/`
- Two locales: `de` (default), `en`. Dictionaries in `lib/dictionaries/de.json` and `en.json`
- Root `/` redirects to `/de` via middleware
- `middleware.ts` handles i18n redirects AND Clerk auth — public routes bypass Clerk entirely, protected routes (dashboard, profil, subscription) go through `authMiddleware`

### Database — Dual Schema

There are **two separate database layers** that coexist:

1. **Prisma schema** (`prisma/schema.prisma`) — defines the app's transactional models (User, Job, Offer, Message, Review, Payment, Notification, CraftsmanProfile). Uses Clerk `clerkId` for user identity.
2. **Raw Neon SQL** (`lib/db.ts`) — queries a `handwerker` table directly via `@neondatabase/serverless` for the public-facing craftsman directory/search. Types in `lib/types.ts` (`Handwerker`, `Bewertung`, `FilterParams`).

These two schemas serve different parts of the app. The raw SQL layer powers SEO pages and public search; the Prisma layer powers authenticated features (jobs, offers, chat, payments).

### Server Actions

All server-side mutations live in `lib/actions/` as separate files per domain (e.g., `craftsman-actions.ts`, `job-actions.ts`, `stripe-actions.ts`, `subscription-actions.ts`).

### SEO Pages

Heavy SEO focus with dynamically generated pages:
- `app/[lang]/handwerker/stadt/` and `app/[lang]/handwerker/kategorie/` — city/trade combo pages
- `app/[lang]/ratgeber/[slug]` — blog/guide articles
- `app/[lang]/kosten/[slug]` — cost guide pages
- SEO content generation logic in `lib/seo.ts` and `lib/seo-data.ts`
- Domain types (`GEWERKE`, `STAEDTE`, `GEWERK_LABELS`) defined in `lib/types.ts` — these are the canonical lists of supported trades and cities

### Key Integrations

- **Auth**: Clerk (`@clerk/nextjs`)
- **Payments**: Stripe (`lib/stripe.ts`, `lib/actions/stripe-actions.ts`)
- **Database**: Neon PostgreSQL (both via `@neondatabase/serverless` directly and via Prisma)
- **UI**: shadcn/ui components in `components/ui/`, Tailwind CSS, Radix primitives

### SQL Migrations

Sequential SQL files in `scripts/` (e.g., `003-add-subscription-tables.sql`, `015-fix-eni-hourly-rate.sql`). Run via `npm run db:migrate`.

## Environment Variables

Required: `DATABASE_URL`, Clerk keys, `STRIPE_SECRET_KEY` (optional — app degrades gracefully without it).
