-- ============================================================================
-- MIGRATION: 20261003180000_add_category_insert_policy.sql
-- Fix RLS: allow authenticated users to insert categories
-- ============================================================================
--
-- PROBLEM: The categories table had SELECT policies but no INSERT policy.
-- When resolveCategoryId() tried to create a new category, Supabase blocked
-- the operation with "new row violates row-level security policy for table categories".
--
-- SOLUTION: Add INSERT policy for authenticated users.
-- Anonymous users remain unable to create categories.
-- ============================================================================

CREATE POLICY "Authenticated insert categories"
  ON public.categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
