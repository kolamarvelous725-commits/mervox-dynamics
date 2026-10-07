-- Contact Messages Table & RLS Policies

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project_type TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;

-- Policy: Anyone can submit a contact message
CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- Policy: Admins can view contact messages
CREATE POLICY "Admins can view contact messages" ON public.contact_messages
  FOR SELECT USING (
    (auth.jwt() ->> 'email') IN ('marvelousotugalu012@gmail.com', 'kolamarvelous725@gmail.com', 'mervoxdynamic@gmail.com')
  );
