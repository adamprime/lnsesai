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
- 355 content units with ~1,978 components and 41 tags
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
| New book batch (124 books) | Uploaded to Supabase | main | 113 new content units, 771 components, 11 new tags, 135 tag assignments created. 6 books with wrong content flagged for John to redo. John adjusting weights/lenses in admin UI. |

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
- **Goal:** Process new book batches; respond to John's prioritization questions; upload to Supabase
- **Accomplished:** Split 124 books into individual files. Applied John's corrections. Generated catalog (28 tags, 124 books). Uploaded to Supabase: 113 new content units, 771 components, 11 new tags, 135 tag assignments. Updated migrate_catalog.py to accept --catalog arg. Refined flagged list: only 6 books genuinely wrong (not 17).
- **Didn't finish:** 6 books with wrong AI summaries need redoing by John. 5 books from first batch getting redone. John to adjust weights/lenses in admin UI.
- **Discovered:** Most "flagged" items were actually fine (articles or right-topic content from slightly different source). Real error rate ~5% not 14%.

### 2026-02-09
- **Goal:** Initialize compound engineering docs structure
- **Accomplished:** Created docs/ directory with STATUS.md, plans/, solutions/, decisions/, brainstorms/
- **Didn't finish:** N/A
- **Discovered:** N/A
