# Project Status
<!-- Updated: 2026-02-16 by Adam -->

## Project Overview

**Lnses** (lnses.ai) is a platform-agnostic knowledge lens service. Users can browse or generate custom "lenses"—curated knowledge packages from business books and articles—and paste them into any AI chat for better, more informed responses.

## Current State

**Phase:** Admin Interface Complete, Customer Interface Pending
**Last Session:** 2026-02-16
**Last Session Summary:** Processed 22 new books from John's batch; created response doc for John covering prioritization, weighting, and multi-lens questions

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
| New book batch (124 books) | Waiting on John | main | 124 books split into individual files. First batch corrections applied. 17 flagged in new export for John to review. 5 getting redone. Waiting on John before Supabase upload. |

## What's Next

1. Customer-facing lens browsing
2. Custom lens generation via chat
3. Lens compilation with token counting
4. Copy to clipboard functionality

## Open Decisions

| Decision | Options Considered | Leaning Toward | Blocking? |
|----------|--------------------|----------------|-----------|
| Book sequencing within lenses | Add display_order to tag assignments vs. keyword routing logic | display_order field | No -- future feature for chat interface |
| Two-tier vs. three-tier weighting | Weight 1/3 (two tier) vs. 1/2/3 | Two tier (1 and 3) | No |

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

### 2026-02-16
- **Goal:** Process new book batches; respond to John's prioritization questions
- **Accomplished:** Split 124 books into individual files (lenses/new-individual/) from two exports. Applied John's first-round corrections (tags, author names, title typos). Identified 17 flagged books in second export for John to review. Updated response doc with full status.
- **Didn't finish:** Supabase upload -- blocked on John reviewing 17 flagged books and 5 getting redone. Next step: once John confirms, run generator + migrate_catalog.
- **Discovered:** AI analysis tool frequently confuses similar titles, summarizes wrong books, and flags articles vs books. ~14% error rate on the new batch.

### 2026-02-09
- **Goal:** Initialize compound engineering docs structure
- **Accomplished:** Created docs/ directory with STATUS.md, plans/, solutions/, decisions/, brainstorms/
- **Didn't finish:** N/A
- **Discovered:** N/A
