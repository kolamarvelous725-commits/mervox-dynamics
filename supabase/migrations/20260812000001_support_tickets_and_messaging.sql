-- Support Tickets & Ticket Messages Schema and RLS Policies

-- 1. Support Tickets Table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT 'General',
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ticket Messages (Conversation replies on support tickets)
CREATE TABLE IF NOT EXISTS public.ticket_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id TEXT REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_id UUID,
  sender_role TEXT NOT NULL DEFAULT 'student',
  sender_name TEXT,
  text TEXT NOT NULL,
  time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Students can view and manage their own tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Admins have full access to support tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Students can view and post ticket messages" ON public.ticket_messages;
DROP POLICY IF EXISTS "Admins have full access to ticket messages" ON public.ticket_messages;

-- RLS for support_tickets
CREATE POLICY "Students can view and manage their own tickets" ON public.support_tickets
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins have full access to support tickets" ON public.support_tickets
  FOR ALL USING (
    (auth.jwt() ->> 'email') IN ('marvelousotugalu012@gmail.com', 'kolamarvelous725@gmail.com')
  );

-- RLS for ticket_messages
CREATE POLICY "Students can view and post ticket messages" ON public.ticket_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.support_tickets st
      WHERE st.id = ticket_id AND st.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins have full access to ticket messages" ON public.ticket_messages
  FOR ALL USING (
    (auth.jwt() ->> 'email') IN ('marvelousotugalu012@gmail.com', 'kolamarvelous725@gmail.com')
  );

-- RLS for messages table update (ensure both sides have full access)
DROP POLICY IF EXISTS "Users can access their own messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can view and send messages" ON public.messages;

CREATE POLICY "Users can access their own messages" ON public.messages 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view and send messages" ON public.messages 
  FOR ALL USING (
    (auth.jwt() ->> 'email') IN ('marvelousotugalu012@gmail.com', 'kolamarvelous725@gmail.com')
  );
