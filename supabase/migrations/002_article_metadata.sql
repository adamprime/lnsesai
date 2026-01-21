-- Add article-specific metadata fields to content_units
-- Run this in Supabase SQL Editor

ALTER TABLE content_units
ADD COLUMN IF NOT EXISTS publication TEXT,          -- Journal/publication name
ADD COLUMN IF NOT EXISTS volume TEXT,               -- Volume number
ADD COLUMN IF NOT EXISTS issue TEXT,                -- Issue number  
ADD COLUMN IF NOT EXISTS pages TEXT,                -- Page range (e.g., "277-300")
ADD COLUMN IF NOT EXISTS doi TEXT,                  -- DOI identifier
ADD COLUMN IF NOT EXISTS url TEXT,                  -- Source URL
ADD COLUMN IF NOT EXISTS edition TEXT;              -- Edition (for books too)

-- Add index for DOI lookups
CREATE INDEX IF NOT EXISTS idx_content_units_doi ON content_units(doi) WHERE doi IS NOT NULL;

COMMENT ON COLUMN content_units.publication IS 'Journal or publication name (for articles)';
COMMENT ON COLUMN content_units.volume IS 'Volume number (for articles)';
COMMENT ON COLUMN content_units.issue IS 'Issue number (for articles)';
COMMENT ON COLUMN content_units.pages IS 'Page range, e.g., 277-300';
COMMENT ON COLUMN content_units.doi IS 'Digital Object Identifier';
COMMENT ON COLUMN content_units.url IS 'Source URL';
COMMENT ON COLUMN content_units.edition IS 'Edition number (for books)';
