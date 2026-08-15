-- Migration: Update support tickets schema and policies
-- 1. Add resolved_at column if not exists
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ;

-- 2. Drop hardcoded email policy for admins
DROP POLICY IF EXISTS "Admins have full access to support tickets" ON public.support_tickets;

-- 3. Create secure admin policy using public.is_admin()
CREATE POLICY "Admins have full access to support tickets" ON public.support_tickets
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
