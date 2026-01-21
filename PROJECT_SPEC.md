# Lnses (lnses.ai) - Project Specification

**Version:** 1.0  
**Date:** 2025-01-14  
**Status:** Planning  
**Domain:** lnses.ai

---

## Executive Summary

Lnses is a platform-agnostic knowledge lens service that enables users to generate custom, AI-ready context packages from curated business book and article content. Users interact with a simple chat interface to describe their needs, and the system compiles relevant content units into a "lens" they can copy and paste into any AI chat interface (ChatGPT, Claude, Gemini, Copilot, etc.).

### Core Value Proposition

- **For Users**: Get expert-curated knowledge frameworks assembled for your specific situation, usable in any AI platform
- **For John (Admin)**: A streamlined interface to manage, edit, and expand the knowledge base

---

## Technical Decisions

### Infrastructure

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Database** | Supabase (Postgres) | Managed Postgres with great dashboard, generous free tier, easy scaling |
| **Authentication** | Clerk (existing) | Already configured with wildcard domain for alignmentengines.com |
| **Frontend** | TBD (likely Next.js or React + Vite) | Modern, fast, good DX |
| **Hosting** | TBD (Vercel, Netlify, or Railway) | Depends on frontend choice |
| **Repository** | New repo: `lnses` | Clean separation from legacy Alignment Engines app |

### Key Design Principles

1. **Platform Agnostic**: The output is copyable text, usable anywhere
2. **Weighted Content**: Priority system (1-3) ensures best content surfaces first
3. **Granular Tagging**: Tags at content unit level (default) with optional component-level tagging
4. **Token-Aware**: Track token counts to fit AI context windows
5. **Admin-First**: Build for John's workflow, then layer on customer experience

---

## Database Schema

### Core Tables

```sql
-- Content Units (books, articles, etc.)
CREATE TABLE content_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('book', 'article', 'video', 'podcast')),
  publication_year INTEGER,
  source_files TEXT[], -- for migration tracking
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by_id UUID REFERENCES auth.users(id)
);

-- Content Components (summary, themes, frameworks, etc.)
CREATE TABLE content_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_unit_id UUID NOT NULL REFERENCES content_units(id) ON DELETE CASCADE,
  component_type TEXT NOT NULL CHECK (component_type IN ('summary', 'theme', 'framework', 'key_concept')),
  title TEXT, -- e.g., "Theme 1: Customer as Hero"
  content TEXT NOT NULL, -- main markdown body
  explanation TEXT, -- for themes
  examples TEXT, -- for themes
  token_count INTEGER,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Unit Tags (primary tagging mechanism)
CREATE TABLE content_unit_tags (
  content_unit_id UUID REFERENCES content_units(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  weight INTEGER NOT NULL DEFAULT 1 CHECK (weight BETWEEN 1 AND 3),
  -- 1 = low priority, 2 = medium, 3 = high priority
  PRIMARY KEY (content_unit_id, tag_id)
);

-- Component Tags (optional granular tagging)
CREATE TABLE component_tags (
  content_component_id UUID REFERENCES content_components(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  weight INTEGER NOT NULL DEFAULT 1 CHECK (weight BETWEEN 1 AND 3),
  PRIMARY KEY (content_component_id, tag_id)
);

-- Pre-built Lenses (John's curated collections)
CREATE TABLE prebuilt_lenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_by_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pre-built Lens Components
CREATE TABLE prebuilt_lens_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prebuilt_lens_id UUID REFERENCES prebuilt_lenses(id) ON DELETE CASCADE,
  content_component_id UUID REFERENCES content_components(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- Indexes for performance
CREATE INDEX idx_content_units_status ON content_units(status);
CREATE INDEX idx_content_components_unit ON content_components(content_unit_id);
CREATE INDEX idx_content_unit_tags_tag ON content_unit_tags(tag_id);
CREATE INDEX idx_component_tags_tag ON component_tags(tag_id);
```

### Weight System

| Weight | Label | Usage |
|--------|-------|-------|
| 1 | Low | Default. Content is relevant but not primary |
| 2 | Medium | Good content, notable for this topic |
| 3 | High | Best-in-class content, should appear first |

---

## Epics & User Stories

### Epic 1: Infrastructure & Database Setup

**Goal**: Establish the foundational infrastructure and migrate existing content.

#### Stories

**1.1 - Set up Supabase project**
- Create new Supabase project for LensShift
- Configure database schema (all tables above)
- Set up Row Level Security policies (future multi-tenant ready)
- **Acceptance Criteria**: Schema deployed, can connect from local dev

**1.2 - Create migration script**
- Parse existing `lenses/generated/catalog.json` 
- Extract content units (books) with their components (summary, themes)
- Preserve existing tags
- Map priority markers to weight system (priority=1 → weight=3)
- **Acceptance Criteria**: ~243 books migrated with components and tags

**1.3 - Token counting utility**
- Implement token counting (tiktoken or similar)
- Backfill token_count for all components
- **Acceptance Criteria**: All components have accurate token counts

**1.4 - Initialize repository**
- Set up project structure (frontend, shared types, etc.)
- Configure linting, formatting, TypeScript
- Set up environment variables pattern
- **Acceptance Criteria**: Clean repo with dev environment working

---

### Epic 2: Admin Interface (Content Management)

**Goal**: Give John a web interface to browse, edit, and manage content units.

#### Stories

**2.1 - Admin authentication**
- Integrate Clerk authentication
- Restrict admin routes to authorized users
- **Acceptance Criteria**: Only John (and designated admins) can access

**2.2 - Content unit list view**
- Display all content units in a searchable, filterable table
- Show: title, author, source type, status, tag count, component count
- Filter by: status (draft/published), source type, tag
- Sort by: title, author, created date, updated date
- **Acceptance Criteria**: Can browse and find any content unit quickly

**2.3 - Content unit detail view**
- View full content unit with all components
- Display metadata (title, author, year, source type)
- Show all components in order (summary, themes, frameworks)
- Display assigned tags with weights
- **Acceptance Criteria**: Full read view of any content unit

**2.4 - Edit content unit metadata**
- Edit title, author, publication year, source type
- Change status (draft ↔ published)
- **Acceptance Criteria**: Changes persist to database

**2.5 - Edit content components**
- Inline or modal editing for each component
- Markdown editor for content field
- Edit title, explanation, examples (for themes)
- Reorder components via drag-and-drop
- **Acceptance Criteria**: Can edit any component, changes persist

**2.6 - Manage tags on content unit**
- View current tags with weights
- Add new tags (search/select from existing or create new)
- Set weight (1-3) for each tag
- Remove tags
- **Acceptance Criteria**: Full tag CRUD with weight control

**2.7 - Add new content unit**
- Form to create new content unit
- Add components (summary, themes, etc.)
- Assign tags
- Save as draft initially
- **Acceptance Criteria**: Can create content from scratch

**2.8 - Delete content unit**
- Soft delete or archive functionality
- Confirmation dialog
- **Acceptance Criteria**: Can remove content units safely

**2.9 - Tag management page**
- List all tags with usage counts
- Create new tags
- Edit tag name/description
- Merge duplicate tags (optional, nice-to-have)
- **Acceptance Criteria**: Central place to manage taxonomy

**2.10 - Pre-built lens management**
- Create/edit pre-built lenses
- Select components to include (from any content unit)
- Set display order
- Preview compiled lens with token count
- **Acceptance Criteria**: John can curate lens collections

---

### Epic 3: Customer Interface (Lens Generation)

**Goal**: Public-facing interface where users can get custom lenses.

#### Stories

**3.1 - Customer authentication**
- Login/register via Clerk
- Simple onboarding (minimal friction)
- **Acceptance Criteria**: Users can sign up and log in

**3.2 - Pre-built lens gallery**
- Display featured/available pre-built lenses
- Show name, description, book count, total tokens
- One-click copy to clipboard
- **Acceptance Criteria**: Users can browse and copy pre-built lenses

**3.3 - Custom lens chat interface**
- Simple chat input to describe situation/need
- AI analyzes request and selects relevant content units/components
- Display selected content with reasoning
- **Acceptance Criteria**: Basic AI-powered lens assembly

**3.4 - Custom lens compilation**
- Compile selected components into formatted lens
- Include context header (what this lens covers)
- Show token count and compatibility hints
- Copy to clipboard button
- **Acceptance Criteria**: Users get copy-ready lens text

**3.5 - Lens customization**
- Allow users to adjust AI selections
- Add/remove components manually
- Adjust for different context window sizes (8K, 32K, 100K)
- **Acceptance Criteria**: Users have control over final output

**3.6 - Usage instructions**
- "How to use this lens" guidance
- Platform-specific tips (ChatGPT, Claude, etc.)
- **Acceptance Criteria**: Users understand how to use their lens

**3.7 - History/saved lenses (nice-to-have)**
- Save compiled lenses for later
- View history of generated lenses
- **Acceptance Criteria**: Users can revisit past lenses

---

## Phases / Milestones

### Phase 1: Foundation (Weeks 1-2)
- Epic 1 complete (infrastructure, migration, repo setup)
- Database populated with existing content
- Local dev environment working

### Phase 2: Admin MVP (Weeks 3-5)
- Stories 2.1 - 2.6 complete
- John can browse, view, and edit content
- Basic tag management

### Phase 3: Admin Complete (Weeks 6-7)
- Stories 2.7 - 2.10 complete
- Full content creation workflow
- Pre-built lens curation

### Phase 4: Customer MVP (Weeks 8-10)
- Stories 3.1 - 3.4 complete
- Users can get pre-built lenses
- Basic custom lens generation

### Phase 5: Polish & Launch (Weeks 11-12)
- Stories 3.5 - 3.7
- UX polish
- Production deployment
- Soft launch

---

## Open Questions

1. **Frontend framework**: Next.js (app router) vs React + Vite?
   - Next.js: Better for SEO, built-in API routes, Vercel deployment
   - React + Vite: Simpler, more flexible hosting options

2. **Hosting**: Vercel, Netlify, or Railway?
   - Depends on frontend choice and any backend needs beyond Supabase

3. **AI for custom lens compilation**: Which model/approach?
   - Could use OpenAI function calling to select content units
   - Could use embeddings for semantic search
   - Could be simpler keyword/tag matching initially

4. ~~**Domain**: Will this live at a subdomain of alignmentengines.com or separate domain?~~
   - **RESOLVED**: lnses.ai

5. **Legacy cleanup timing**: When to dismantle old infrastructure?
   - After Phase 1 (once content is safely migrated)?
   - After full launch?

---

## Content Migration Notes

### Source Data
- Location: `/Users/adam/coding/ai-strengths/lenses/generated/catalog.json`
- ~243 books across ~31 tags
- Each book has: title, author, sources, body (markdown), tags

### Parsing Strategy
1. Parse `catalog.json`
2. For each book entry:
   - Create `content_unit` record
   - Parse body markdown to extract:
     - Summary section → `content_component` (type: summary)
     - Each "Theme N:" section → `content_component` (type: theme)
   - Map existing tags → `content_unit_tags`
   - If book had priority marker → set weight=3

### Edge Cases
- Some books appear in multiple tags (deduplication needed)
- Theme structure varies slightly between books
- Some older exports may have different formatting

---

## Related Documents

- Original lenses brainstorm: `/Users/adam/coding/ai-strengths/specs/lenses-distribution-brainstorm.md`
- Lens generation workflow: `/Users/adam/coding/ai-strengths/LENS_GENERATION_WORKFLOW.md`
- Existing catalog: `/Users/adam/coding/ai-strengths/lenses/generated/catalog.json`

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2025-01-14 | 1.0 | Initial spec created |
