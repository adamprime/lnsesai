# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Project Overview

**Lnses** (lnses.ai) is a platform-agnostic knowledge lens service. Users can browse or generate custom "lenses"—curated knowledge packages from business books and articles—and paste them into any AI chat for better, more informed responses.

## Tech Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Database:** Supabase (Postgres)
- **Auth:** Clerk
- **Styling:** Tailwind CSS
- **Testing:** Vitest + React Testing Library
- **Hosting:** Netlify + Cloudflare

## Development Commands

```bash
# Start dev server
npm run dev

# Run tests once
npm run test:run

# Run tests in watch mode
npm test

# Build for production
npm run build

# Lint
npm run lint
```

## Architecture

### App Structure (Next.js App Router)

```
src/app/
├── layout.tsx           # Root layout with ClerkProvider
├── page.tsx             # Landing page
├── dashboard/           # Authenticated user dashboard
├── admin/               # Admin interface (email allowlist protected)
│   ├── layout.tsx       # Admin nav with auth check
│   ├── content/         # Content unit management
│   ├── tags/            # Tag management
│   └── docs/            # Internal documentation
├── api/admin/           # Admin API routes
└── sign-in/, sign-up/   # Clerk auth pages
```

### Key Patterns

1. **Server Components by Default** - Pages fetch data server-side using `createServerSupabaseClient()`
2. **Client Components for Interactivity** - Forms and interactive UI use `"use client"` directive
3. **API Routes for Mutations** - All data mutations go through `/api/admin/*` routes
4. **Email Allowlist for Admin** - `src/lib/admin.ts` controls admin access

### Database Access

```typescript
// Server-side (in Server Components or API routes)
import { createServerSupabaseClient } from "@/lib/supabase-server";
const supabase = createServerSupabaseClient();

// Client-side (rarely needed)
import { createClient } from "@/lib/supabase";
const supabase = createClient();
```

### Admin Authorization

```typescript
import { isAdminEmail, ADMIN_EMAILS } from "@/lib/admin";

// Check if user is admin
if (!isAdminEmail(userEmail)) {
  redirect("/");
}
```

## Testing Approach

**Test-Driven Development (TDD)** is the core methodology:

1. Write tests first in `*.test.ts` files alongside source files
2. Run tests to see them fail
3. Implement the feature
4. Run tests to see them pass

### Test File Locations

- `src/lib/api/*.test.ts` - API logic tests
- `src/lib/*.test.ts` - Utility tests

### Running Specific Tests

```bash
# Run a specific test file
npm run test:run -- src/lib/api/content-units.test.ts

# Run tests matching a pattern
npm run test:run -- -t "updateContentUnit"
```

### Mocking

Tests mock external dependencies:
- Supabase client is mocked via `vi.mock("@/lib/supabase-server")`
- Clerk is mocked in `src/test/setup.ts`

## Database Schema (Key Tables)

### content_units
Books, articles, videos, podcasts with metadata.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| title | TEXT | Required |
| author | TEXT | Required |
| source_type | TEXT | book, article, video, podcast |
| status | TEXT | draft, published |
| publication_year | INT | Optional |
| publication | TEXT | Journal name (articles) |
| volume, issue, pages | TEXT | Article citation |
| doi, url | TEXT | References |

### content_components
Summaries, themes, frameworks extracted from content units.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| content_unit_id | UUID | Foreign key |
| component_type | TEXT | summary, theme, framework, key_concept |
| content | TEXT | Main content (markdown) |
| title | TEXT | Optional title |
| explanation | TEXT | For themes |
| examples | TEXT | For themes |
| display_order | INT | Ordering |
| token_count | INT | For context window fitting |

### tags & content_unit_tags
Topic labels with weighted associations.

```sql
-- Weight system: 1=low, 2=medium, 3=high priority
-- Higher weight = content is more central to that topic
content_unit_tags (content_unit_id, tag_id, weight)
```

## API Patterns

### Admin API Routes

All admin mutations follow this pattern:

```typescript
// src/app/api/admin/[resource]/[id]/route.ts
import { NextResponse } from "next/server";
import { updateResource } from "@/lib/api/resource";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  
  const result = await updateResource(id, body);
  
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  
  return NextResponse.json(result.data);
}
```

### Business Logic Location

Keep business logic in `src/lib/api/*.ts` files, not in route handlers. This allows:
- Easy unit testing
- Reuse across routes
- Clear separation of concerns

## Component Patterns

### Admin Components

Located in `src/components/admin/`:
- `EditContentUnitForm.tsx` - Editable metadata form
- `ManageTagsSection.tsx` - Tag assignment with weights
- `EditComponentCard.tsx` - Inline component editing
- `HelpTooltip.tsx` - Links to documentation

### Markdown Rendering

Use `MarkdownContent` component for rendering markdown in view mode:

```tsx
import { MarkdownContent } from "@/components/MarkdownContent";

// View mode: render markdown
<MarkdownContent content={component.content} />

// Edit mode: raw textarea
<textarea value={content} onChange={...} />
```

## Environment Variables

Required in `.env.local` (local) or Netlify (production):

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

## Deployment

- **Hosting:** Netlify (auto-deploys from `main` branch)
- **DNS/SSL:** Cloudflare (proxied, Full SSL mode)
- **Domain:** lnses.ai

### Netlify Configuration

See `netlify.toml` for build settings and secret scan omissions.

## Code Style

- TypeScript strict mode
- Functional components with hooks
- Server Components by default, `"use client"` only when needed
- Tailwind for styling (dark theme: gray-900 background, gray-800 cards)
- Minimal comments—code should be self-documenting
- No documentation updates unless explicitly requested

## Common Tasks

### Adding a New Admin Feature

1. Write tests in `src/lib/api/[feature].test.ts`
2. Implement logic in `src/lib/api/[feature].ts`
3. Create API route in `src/app/api/admin/[feature]/route.ts`
4. Build UI component in `src/components/admin/`
5. Add to page in `src/app/admin/`

### Adding an Admin Email

Edit `src/lib/admin.ts`:

```typescript
export const ADMIN_EMAILS = [
  "existing@email.com",
  "new@email.com",  // Add here
];
```

### Running Database Migrations

Migrations are in `supabase/migrations/`. Run them in Supabase SQL Editor.
