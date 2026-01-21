# Lnses (lnses.ai)

A platform-agnostic knowledge lens service that enables users to generate custom, AI-ready context packages from curated business book and article content.

## Live Site

**Production:** https://lnses.ai

## Overview

Lnses allows users to:
1. Browse pre-built knowledge lenses (curated collections on topics like Feedback, Leadership, Coaching)
2. Generate custom lenses via a chat interface that assembles relevant content for their specific situation
3. Copy the compiled lens and paste it into any AI chat (ChatGPT, Claude, Gemini, Copilot, etc.)

## Project Status

**Current Phase:** Admin Interface Complete, Customer Interface Pending

### Completed
- [x] Database schema and Supabase setup
- [x] 243 content units migrated with 1,207 components and 30 tags
- [x] Admin authentication with email allowlist
- [x] Full admin CRUD interface (TDD with 43 tests)
- [x] Edit content unit metadata (books, articles, videos, podcasts)
- [x] Manage tags with 1-2-3 weight system
- [x] Edit components with markdown rendering
- [x] Comprehensive admin documentation
- [x] Production deployment to Netlify + Cloudflare

### Next Up
- [ ] Customer-facing lens browsing
- [ ] Custom lens generation via chat
- [ ] Lens compilation with token counting
- [ ] Copy to clipboard functionality

## Tech Stack

| Component | Choice |
|-----------|--------|
| **Database** | Supabase (Postgres) |
| **Auth** | Clerk (production) |
| **Frontend** | Next.js 15 + TypeScript |
| **Styling** | Tailwind CSS |
| **Testing** | Vitest + React Testing Library |
| **Hosting** | Netlify |
| **DNS/SSL** | Cloudflare |

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Clerk account

### Local Development

```bash
# Clone the repo
git clone git@github.com:adamprime/lnsesai.git
cd lnsesai

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your keys

# Run development server
npm run dev
```

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### Running Tests

```bash
# Run all tests
npm run test:run

# Run tests in watch mode
npm test
```

## Project Structure

```
src/
├── app/
│   ├── admin/           # Admin dashboard
│   │   ├── content/     # Content management
│   │   ├── tags/        # Tag management
│   │   └── docs/        # Internal documentation
│   ├── dashboard/       # User dashboard
│   ├── api/             # API routes
│   └── sign-in/         # Auth pages
├── components/
│   └── admin/           # Admin UI components
├── lib/
│   ├── admin.ts         # Admin authorization
│   ├── api/             # API logic with tests
│   └── supabase*.ts     # Database clients
└── test/
    └── setup.ts         # Test configuration
```

## Database Schema

See [PROJECT_SPEC.md](./PROJECT_SPEC.md) for full schema details.

**Key Tables:**
- `content_units` - Books, articles, videos, podcasts
- `content_components` - Summaries, themes, frameworks broken out from content
- `tags` - Topic labels for organizing content
- `content_unit_tags` - Junction table with weight (1-3) for prioritization

## Admin Access

Admin access is controlled by email allowlist in `src/lib/admin.ts`. Authorized users see an "Admin" button in the dashboard nav.

## Documentation

- [Project Specification](./PROJECT_SPEC.md) - Full spec with epics and stories
- [Internal Admin Docs](/admin/docs) - Available at lnses.ai/admin/docs for admins
