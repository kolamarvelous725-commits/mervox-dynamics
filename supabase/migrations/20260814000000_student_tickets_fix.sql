-- Migration: Support Tickets Name and Status Update
-- 1. Add student_name column to public.support_tickets if not exists
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS student_name TEXT;

-- 2. Modify status column default to 'active'
ALTER TABLE public.support_tickets ALTER COLUMN status SET DEFAULT 'active';

-- 3. Update existing statuses 'Open' to 'active'
UPDATE public.support_tickets SET status = 'active' WHERE status = 'Open';

-- 4. Re-establish support_tickets RLS policies with strict student access
DROP POLICY IF EXISTS "Students can view and manage their own tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Students can select their own tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Students can insert their own tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Admins have full access to support tickets" ON public.support_tickets;

-- Students can ONLY select their own tickets
CREATE POLICY "Students can select their own tickets" ON public.support_tickets
  FOR SELECT USING (auth.uid() = user_id);

-- Students can ONLY insert their own tickets
CREATE POLICY "Students can insert their own tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins have full access
CREATE POLICY "Admins have full access to support tickets" ON public.support_tickets
  FOR ALL USING (
    (auth.jwt() ->> 'email') IN ('marvelousotugalu012@gmail.com', 'kolamarvelous725@gmail.com')
  );
