-- Drop RLS bypass function from previous implementation
DROP FUNCTION IF EXISTS public.complete_payment_and_enroll(TEXT, UUID, TEXT, NUMERIC, TEXT);

-- Enable RLS on payments table
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies on payments table
DROP POLICY IF EXISTS "Users can access their own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can view student payments" ON public.payments;
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can insert their own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins have full access to payments" ON public.payments;

-- Create secure RLS policies
-- 1. Student can select/view their own payments
CREATE POLICY "Users can view their own payments" 
ON public.payments 
FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Student can insert their own payments
CREATE POLICY "Users can insert their own payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. Admins have full CRUD access to all payments using public.is_admin()
CREATE POLICY "Admins have full access to payments" 
ON public.payments 
FOR ALL 
USING (public.is_admin())
WITH CHECK (public.is_admin());
