-- Migration: Fix Infinite Recursion in Profiles RLS Policy
-- This script removes the self-referential subquery on profiles table to prevent PostgreSQL loop crashes.

DROP POLICY IF EXISTS "Admins can access all profiles" ON public.profiles;

CREATE POLICY "Admins can access all profiles" ON public.profiles FOR ALL USING (
  (auth.jwt() ->> 'email') = 'marvelousotugalu012@gmail.com'
);
