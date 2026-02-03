# Lens Content Workflow

This guide explains how to manage lens content from raw book analysis exports through to the Supabase database.

## Directory Structure

```
lnsesai/
├── tools/                      # Python lens tooling
│   ├── update_tags.py          # Apply tag updates from spreadsheet
│   ├── generator.py            # Generate lens files from markdown
│   ├── split_sources.py        # Split into individual source files
│   └── requirements.txt        # Python dependencies
├── lenses/
│   ├── raw/                    # Source book analysis exports (never modified)
│   ├── updated/                # Intermediate files with tag updates (gitignored)
│   ├── generated/              # Generated lens files + catalog.json
│   ├── individual_sources/     # One file per book (for review)
│   └── sources_overview.csv    # CSV overview of all sources
├── books_kb.xlsx               # Tag updates & priority assignments
└── scripts/                    # Node.js scripts (Supabase migration)
```

## Content Pipeline

```
Raw Exports (lenses/raw/)
    ↓ tools/update_tags.py + books_kb.xlsx
Updated Files (lenses/updated/) [gitignored]
    ↓ tools/generator.py
Generated (lenses/generated/catalog.json)
    ↓ scripts/migrate-to-supabase.js
Supabase Database
    ↓
lnses.ai Admin UI (small edits)
```

## Quick Start

### Setup (one time)

```bash
cd /Users/adam/coding/lnsesai

# Create/activate Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r tools/requirements.txt
```

### Full Regeneration Workflow

```bash
# Activate virtual environment
source venv/bin/activate

# Step 1: Apply tag updates and priorities from spreadsheet
python tools/update_tags.py

# Step 2: Generate lens files and catalog.json
python tools/generator.py --catalog-json lenses/generated/catalog.json --overwrite

# Step 3: (Optional) Split into individual source files for review
python tools/split_sources.py --overwrite

# Step 4: Migrate to Supabase (if needed)
# node scripts/migrate-to-supabase.js
```

## Tool Reference

### update_tags.py

Applies tag updates and priority markers from the spreadsheet to raw markdown files.

| Flag | Default | Description |
|------|---------|-------------|
| `--input-dir` | `lenses/raw` | Directory containing source exports |
| `--output-dir` | `lenses/updated` | Destination for updated files |
| `--spreadsheet` | `books_kb.xlsx` | Excel file with tag/priority data |
| `--verbose` | off | Enable detailed logging |

### generator.py

Generates tag-based lens markdown files from processed exports.

| Flag | Default | Description |
|------|---------|-------------|
| `--input-dir` | `lenses/updated` | Directory containing source exports |
| `--output-dir` | `lenses/generated` | Destination for lens files |
| `--catalog-json` | none | Path for JSON catalog output |
| `--include-tag` | all | Restrict to specific tag(s) |
| `--exclude-tag` | none | Skip specific tag(s) |
| `--overwrite` | off | Replace existing files |
| `--dry-run` | off | Parse only, don't write |
| `--verbose` | off | Enable detailed logging |

### split_sources.py

Splits multi-book exports into individual source files for review.

| Flag | Default | Description |
|------|---------|-------------|
| `--input-dir` | `lenses/raw` | Directory containing source exports |
| `--output-dir` | `lenses/individual_sources` | Destination for split files |
| `--csv` | `lenses/sources_overview.csv` | Path for CSV overview |
| `--overwrite` | off | Replace existing files |
| `--verbose` | off | Enable detailed logging |

## Spreadsheet Format (books_kb.xlsx)

| Column | Purpose | Example |
|--------|---------|---------|
| A | Book Title | "Coaching with the Brain in Mind" |
| B | Author | "Rock" |
| D | Current Tags | "Coaching" |
| E | Updated Tags | Leave blank if no change |
| G | Priority | `1` = primary source, blank = normal |

## Priority Ordering

Books marked with priority `1` in the spreadsheet appear at the top of their lenses:
- Priority books sorted alphabetically among themselves
- Non-priority books follow in alphabetical order

## Outputs

| Output | Location | Description |
|--------|----------|-------------|
| Updated markdown | `lenses/updated/*.md` | Intermediate files (gitignored) |
| Lens files | `lenses/generated/<tag>.md` | One file per lens/tag |
| JSON catalog | `lenses/generated/catalog.json` | All lenses and books |
| Individual sources | `lenses/individual_sources/*.md` | One file per book |
| CSV overview | `lenses/sources_overview.csv` | Spreadsheet of all sources |

## Common Tasks

### Update tags for a book

1. Edit `books_kb.xlsx`, column E (Updated Tags)
2. Run `python tools/update_tags.py`
3. Run `python tools/generator.py --catalog-json lenses/generated/catalog.json --overwrite`

### Mark a book as priority

1. Edit `books_kb.xlsx`, column G (set to `1`)
2. Run the update workflow above

### Add new raw exports

1. Copy new `book_analysis_export_*.md` files to `lenses/raw/`
2. Run the full regeneration workflow
3. Update `books_kb.xlsx` with any new tag assignments

### Review content for completeness

1. Run `python tools/split_sources.py --overwrite`
2. Open `lenses/sources_overview.csv` in Excel/Sheets
3. Incomplete entries are listed first with status column

## Notes

- **Deterministic outputs**: Same inputs always produce identical outputs
- **Raw files preserved**: Files in `lenses/raw/` are never modified
- **Duplicate handling**: Books appearing in multiple exports are merged
- **Tag expansion**: Abbreviated tags (e.g., "OD") are expanded to full names
