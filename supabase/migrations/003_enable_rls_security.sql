-- Migration: Enable Row Level Security on all tables
-- Run this in Supabase SQL Editor
-- 
-- Context: App uses Clerk for auth (not Supabase Auth) and server-side 
-- operations use the service role key which bypasses RLS.
-- This migration blocks all anon key access while service role continues to work.

-- ============================================
-- 1. ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE content_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_unit_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE prebuilt_lenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE prebuilt_lens_components ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. RLS POLICIES
-- ============================================
-- With RLS enabled and no permissive policies for 'anon' role,
-- all anon key access is blocked by default.
-- Service role key bypasses RLS automatically.
--
-- If you later need authenticated user access via Supabase Auth,
-- add policies like:
-- CREATE POLICY "name" ON table FOR SELECT TO authenticated USING (true);

-- ============================================
-- 3. FIX FUNCTION SEARCH PATH (Security Warning)
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ============================================
-- VERIFICATION QUERIES (run after migration)
-- ============================================
-- Check RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
--
-- Check function search_path:
-- SELECT proname, proconfig FROM pg_proc WHERE proname = 'update_updated_at_column';
