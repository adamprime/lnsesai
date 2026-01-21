-- Lnses Database Schema
-- Run this in Supabase SQL Editor

-- Content Units (books, articles, etc.)
CREATE TABLE content_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('book', 'article', 'video', 'podcast')),
  publication_year INTEGER,
  source_files TEXT[],
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by_id TEXT
);

-- Content Components (summary, themes, frameworks, etc.)
CREATE TABLE content_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_unit_id UUID NOT NULL REFERENCES content_units(id) ON DELETE CASCADE,
  component_type TEXT NOT NULL CHECK (component_type IN ('summary', 'theme', 'framework', 'key_concept')),
  title TEXT,
  content TEXT NOT NULL,
  explanation TEXT,
  examples TEXT,
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
  PRIMARY KEY (content_unit_id, tag_id)
);

-- Component Tags (optional granular tagging)
CREATE TABLE component_tags (
  content_component_id UUID REFERENCES content_components(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  weight INTEGER NOT NULL DEFAULT 1 CHECK (weight BETWEEN 1 AND 3),
  PRIMARY KEY (content_component_id, tag_id)
);

-- Pre-built Lenses (curated collections)
CREATE TABLE prebuilt_lenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_by_id TEXT,
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

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_content_units_updated_at
  BEFORE UPDATE ON content_units
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_components_updated_at
  BEFORE UPDATE ON content_components
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prebuilt_lenses_updated_at
  BEFORE UPDATE ON prebuilt_lenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
