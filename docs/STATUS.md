# Project Status
<!-- Updated: 2026-02-09 by Adam -->

## Project Overview

**Lnses** (lnses.ai) is a platform-agnostic knowledge lens service. Users can browse or generate custom "lenses"—curated knowledge packages from business books and articles—and paste them into any AI chat for better, more informed responses.

## Current State

**Phase:** Admin Interface Complete, Customer Interface Pending
**Last Session:** 2026-02-09
**Last Session Summary:** Initial docs structure created via /init-project-docs

## What's Working

- Database schema and Supabase setup
- 243 content units migrated with 1,207 components and 30 tags
- Admin authentication with email allowlist
- Full admin CRUD interface (TDD with 43 tests)
- Edit content unit metadata (books, articles, videos, podcasts)
- Manage tags with 1-2-3 weight system
- Edit components with markdown rendering
- Comprehensive admin documentation
- Production deployment to Netlify + Cloudflare

## What's In Progress

| Item | Status | Branch | Notes |
|------|--------|--------|-------|
|      |        |        |       |

## What's Next

1. Customer-facing lens browsing
2. Custom lens generation via chat
3. Lens compilation with token counting
4. Copy to clipboard functionality

## Open Decisions

| Decision | Options Considered | Leaning Toward | Blocking? |
|----------|--------------------|----------------|-----------|
|          |                    |                |           |

## Known Issues

- 

## Environment & Setup

**Run locally:** `npm run dev`
**Run tests:** `npm run test:run` (or `npm test` for watch mode)
**Build:** `npm run build`
**Lint:** `npm run lint`
**Deploy:** Auto-deploys from `main` branch to Netlify

**Key env vars:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`

## Architecture Notes

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Database:** Supabase (Postgres)
- **Auth:** Clerk
- **Styling:** Tailwind CSS
- **Testing:** Vitest + React Testing Library
- **Hosting:** Netlify + Cloudflare

Server Components by default. Business logic in `src/lib/api/`. Admin access via email allowlist in `src/lib/admin.ts`.

## Session Log

### 2026-02-09
- **Goal:** Initialize compound engineering docs structure
- **Accomplished:** Created docs/ directory with STATUS.md, plans/, solutions/, decisions/, brainstorms/
- **Didn't finish:** N/A
- **Discovered:** N/A
