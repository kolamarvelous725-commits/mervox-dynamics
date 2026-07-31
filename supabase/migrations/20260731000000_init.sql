-- Migration: Initialize schema with tables: profiles, courses, enrollments, live_classes, announcements, assignments, quizzes, certificates, payments, messages, progress

-- 1. Profiles table (primary key references auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'student',
    avatar_url TEXT,
    phone TEXT,
    country TEXT,
    suspended BOOLEAN DEFAULT false,
    bio TEXT,
    occupation TEXT,
    dob TEXT,
    socials JSONB DEFAULT '{}'::jsonb,
    activity JSONB DEFAULT '[]'::jsonb,
    notifications JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can select their own profile" ON public.profiles;
CREATE POLICY "Users can select their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can access all profiles" ON public.profiles;
CREATE POLICY "Admins can access all profiles" ON public.profiles FOR ALL USING (
  (auth.jwt() ->> 'email') = 'marvelousotugalu012@gmail.com'
);

-- Trigger to automatically create a profile record when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name,
    phone, 
    country, 
    role,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'fullName',
      trim(concat(coalesce(new.raw_user_meta_data->>'firstName', ''), ' ', coalesce(new.raw_user_meta_data->>'lastName', '')))
    ),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'country', 'Other'),
    CASE 
      WHEN new.email = 'marvelousotugalu012@gmail.com' THEN 'admin'
      ELSE 'student'
    END,
    now(),
    now()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    thumbnail TEXT,
    lessons JSONB DEFAULT '[]'::jsonb,
    total_lessons INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Courses are viewable by everyone" ON public.courses;
CREATE POLICY "Courses are viewable by everyone" ON public.courses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins have full access to courses" ON public.courses;
CREATE POLICY "Admins have full access to courses" ON public.courses FOR ALL USING (
  (auth.jwt() ->> 'email') = 'marvelousotugalu012@gmail.com'
);

-- 3. Enrollments Table
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'In Progress',
    study_hours INTEGER DEFAULT 0,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, course_id)
);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access their own enrollments" ON public.enrollments;
CREATE POLICY "Users can access their own enrollments" ON public.enrollments FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view and edit student enrollments" ON public.enrollments;
CREATE POLICY "Admins can view and edit student enrollments" ON public.enrollments FOR ALL USING (
  (auth.jwt() ->> 'email') = 'marvelousotugalu012@gmail.com'
);

-- 4. Progress Table
CREATE TABLE IF NOT EXISTS public.progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
    progress_percent INTEGER DEFAULT 0,
    lessons_completed JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, course_id)
);

ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access their own progress" ON public.progress;
CREATE POLICY "Users can access their own progress" ON public.progress FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view and edit student progress" ON public.progress;
CREATE POLICY "Admins can view and edit student progress" ON public.progress FOR ALL USING (
  (auth.jwt() ->> 'email') = 'marvelousotugalu012@gmail.com'
);

-- 5. Quizzes Table
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL,
    score INTEGER NOT NULL,
    passed BOOLEAN NOT NULL,
    date TEXT NOT NULL,
    UNIQUE(user_id, course_id)
);

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access their own quizzes" ON public.quizzes;
CREATE POLICY "Users can access their own quizzes" ON public.quizzes FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view student quizzes" ON public.quizzes;
CREATE POLICY "Admins can view student quizzes" ON public.quizzes FOR ALL USING (
  (auth.jwt() ->> 'email') = 'marvelousotugalu012@gmail.com'
);

-- 6. Assignments Table
CREATE TABLE IF NOT EXISTS public.assignments (
    id TEXT PRIMARY KEY,
    course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
    course_title TEXT NOT NULL,
    title TEXT NOT NULL,
    due_date TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Assignments are viewable by everyone" ON public.assignments;
CREATE POLICY "Assignments are viewable by everyone" ON public.assignments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins have full access to assignments" ON public.assignments;
CREATE POLICY "Admins have full access to assignments" ON public.assignments FOR ALL USING (
  (auth.jwt() ->> 'email') = 'marvelousotugalu012@gmail.com'
);

-- 7. Live Classes Table
CREATE TABLE IF NOT EXISTS public.live_classes (
    id TEXT PRIMARY KEY,
    course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    instructor TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    link TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.live_classes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Live classes are viewable by everyone" ON public.live_classes;
CREATE POLICY "Live classes are viewable by everyone" ON public.live_classes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins have full access to live classes" ON public.live_classes;
CREATE POLICY "Admins have full access to live classes" ON public.live_classes FOR ALL USING (
  (auth.jwt() ->> 'email') = 'marvelousotugalu012@gmail.com'
);

-- 8. Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Announcements are viewable by everyone" ON public.announcements;
CREATE POLICY "Announcements are viewable by everyone" ON public.announcements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins have full access to announcements" ON public.announcements;
CREATE POLICY "Admins have full access to announcements" ON public.announcements FOR ALL USING (
  (auth.jwt() ->> 'email') = 'marvelousotugalu012@gmail.com'
);

-- 9. Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    channel_id TEXT NOT NULL,
    text TEXT NOT NULL,
    sender TEXT NOT NULL,
    time TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, channel_id, text, time)
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access their own messages" ON public.messages;
CREATE POLICY "Users can access their own messages" ON public.messages FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view and send messages" ON public.messages;
CREATE POLICY "Admins can view and send messages" ON public.messages FOR ALL USING (
  (auth.jwt() ->> 'email') = 'marvelousotugalu012@gmail.com'
);

-- 10. Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL,
    course_title TEXT NOT NULL,
    issue_date TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, course_id)
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access their own certificates" ON public.certificates;
CREATE POLICY "Users can access their own certificates" ON public.certificates FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view and edit student certificates" ON public.certificates;
CREATE POLICY "Admins can view and edit student certificates" ON public.certificates FOR ALL USING (
  (auth.jwt() ->> 'email') = 'marvelousotugalu012@gmail.com'
);

-- 11. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    status TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    transaction_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access their own payments" ON public.payments;
CREATE POLICY "Users can access their own payments" ON public.payments FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view student payments" ON public.payments;
CREATE POLICY "Admins can view student payments" ON public.payments FOR ALL USING (
  (auth.jwt() ->> 'email') = 'marvelousotugalu012@gmail.com'
);


-- =============================================
-- SEED DEFAULT DYNAMIC CURRICULUM DATA
-- =============================================

INSERT INTO public.courses (id, title, description, thumbnail, total_lessons, published, lessons) VALUES
('forex-trading', 'Forex Trading Masterclass', 'Learn price action, market structure, risk management, and trading psychology from scratch.', '/course-forex-v3.webp', 20, true, 
  '["Lesson 1: Technical Analysis & Market Structures - Part 1", "Lesson 2: Technical Analysis & Market Structures - Part 2", "Lesson 3: Technical Analysis & Market Structures - Part 3", "Lesson 4: Technical Analysis & Market Structures - Part 4", "Lesson 5: Technical Analysis & Market Structures - Part 5", "Lesson 6: Technical Analysis & Market Structures - Part 6", "Lesson 7: Technical Analysis & Market Structures - Part 7", "Lesson 8: Technical Analysis & Market Structures - Part 8", "Lesson 9: Technical Analysis & Market Structures - Part 9", "Lesson 10: Technical Analysis & Market Structures - Part 10", "Lesson 11: Technical Analysis & Market Structures - Part 11", "Lesson 12: Technical Analysis & Market Structures - Part 12", "Lesson 13: Technical Analysis & Market Structures - Part 13", "Lesson 14: Technical Analysis & Market Structures - Part 14", "Lesson 15: Technical Analysis & Market Structures - Part 15", "Lesson 16: Technical Analysis & Market Structures - Part 16", "Lesson 17: Technical Analysis & Market Structures - Part 17", "Lesson 18: Technical Analysis & Market Structures - Part 18", "Lesson 19: Technical Analysis & Market Structures - Part 19", "Lesson 20: Technical Analysis & Market Structures - Part 20"]'::jsonb),
('ai-automation', 'AI & Business Automation', 'Integrate LLMs, design bots, set workflow triggers, and automate client processes with Make.com.', '/course-ai-v3.webp', 20, true,
  '["Lesson 1: AI Automation & Trigger Funnels - Part 1", "Lesson 2: AI Automation & Trigger Funnels - Part 2", "Lesson 3: AI Automation & Trigger Funnels - Part 3", "Lesson 4: AI Automation & Trigger Funnels - Part 4", "Lesson 5: AI Automation & Trigger Funnels - Part 5", "Lesson 6: AI Automation & Trigger Funnels - Part 6", "Lesson 7: AI Automation & Trigger Funnels - Part 7", "Lesson 8: AI Automation & Trigger Funnels - Part 8", "Lesson 9: AI Automation & Trigger Funnels - Part 9", "Lesson 10: AI Automation & Trigger Funnels - Part 10", "Lesson 11: AI Automation & Trigger Funnels - Part 11", "Lesson 12: AI Automation & Trigger Funnels - Part 12", "Lesson 13: AI Automation & Trigger Funnels - Part 13", "Lesson 14: AI Automation & Trigger Funnels - Part 14", "Lesson 15: AI Automation & Trigger Funnels - Part 15", "Lesson 16: AI Automation & Trigger Funnels - Part 16", "Lesson 17: AI Automation & Trigger Funnels - Part 17", "Lesson 18: AI Automation & Trigger Funnels - Part 18", "Lesson 19: AI Automation & Trigger Funnels - Part 19", "Lesson 20: AI Automation & Trigger Funnels - Part 20"]'::jsonb),
('web-dev', 'Web & Software Development', 'Build interactive apps using React, Tailwind CSS, TypeScript, and modern frameworks.', '/course-webdev-v3.webp', 20, true,
  '["Lesson 1: React Components & NextJS APIs - Part 1", "Lesson 2: React Components & NextJS APIs - Part 2", "Lesson 3: React Components & NextJS APIs - Part 3", "Lesson 4: React Components & NextJS APIs - Part 4", "Lesson 5: React Components & NextJS APIs - Part 5", "Lesson 6: React Components & NextJS APIs - Part 6", "Lesson 7: React Components & NextJS APIs - Part 7", "Lesson 8: React Components & NextJS APIs - Part 8", "Lesson 9: React Components & NextJS APIs - Part 9", "Lesson 10: React Components & NextJS APIs - Part 10", "Lesson 11: React Components & NextJS APIs - Part 11", "Lesson 12: React Components & NextJS APIs - Part 12", "Lesson 13: React Components & NextJS APIs - Part 13", "Lesson 14: React Components & NextJS APIs - Part 14", "Lesson 15: React Components & NextJS APIs - Part 15", "Lesson 16: React Components & NextJS APIs - Part 16", "Lesson 17: React Components & NextJS APIs - Part 17", "Lesson 18: React Components & NextJS APIs - Part 18", "Lesson 19: React Components & NextJS APIs - Part 19", "Lesson 20: React Components & NextJS APIs - Part 20"]'::jsonb),
('youtube-monetization', 'YouTube Algorithm Monetization', 'Master niche creation, scriptwriting, video editing pipelines, and CTR optimization.', '/course-youtube-v3.webp', 20, true,
  '["Lesson 1: YouTube Niches & SEO Mechanics - Part 1", "Lesson 2: YouTube Niches & SEO Mechanics - Part 2", "Lesson 3: YouTube Niches & SEO Mechanics - Part 3", "Lesson 4: YouTube Niches & SEO Mechanics - Part 4", "Lesson 5: YouTube Niches & SEO Mechanics - Part 5", "Lesson 6: YouTube Niches & SEO Mechanics - Part 6", "Lesson 7: YouTube Niches & SEO Mechanics - Part 7", "Lesson 8: YouTube Niches & SEO Mechanics - Part 8", "Lesson 9: YouTube Niches & SEO Mechanics - Part 9", "Lesson 10: YouTube Niches & SEO Mechanics - Part 10", "Lesson 11: YouTube Niches & SEO Mechanics - Part 11", "Lesson 12: YouTube Niches & SEO Mechanics - Part 12", "Lesson 13: YouTube Niches & SEO Mechanics - Part 13", "Lesson 14: YouTube Niches & SEO Mechanics - Part 14", "Lesson 15: YouTube Niches & SEO Mechanics - Part 15", "Lesson 16: YouTube Niches & SEO Mechanics - Part 16", "Lesson 17: YouTube Niches & SEO Mechanics - Part 17", "Lesson 18: YouTube Niches & SEO Mechanics - Part 18", "Lesson 19: YouTube Niches & SEO Mechanics - Part 19", "Lesson 20: YouTube Niches & SEO Mechanics - Part 20"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.live_classes (id, course_id, title, instructor, date, time, link) VALUES
('live-forex', 'forex-trading', 'Live Forex Market Review & Trade setups', 'JPForex Mentor', 'July 31, 2026', '16:00 BST', 'https://zoom.us/j/123456789'),
('live-ai', 'ai-automation', 'ChatGPT Prompts Deep Dive & Make.com workflows', 'AI Automation Specialist', 'August 2, 2026', '18:00 BST', 'https://zoom.us/j/123456790'),
('live-web', 'web-dev', 'React Server Components & Next.js 16 APIs', 'Lead Web Developer', 'August 5, 2026', '17:00 BST', 'https://zoom.us/j/123456791')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.assignments (id, course_id, course_title, title, due_date) VALUES
('asg-forex', 'forex-trading', 'Forex Trading Masterclass', 'Support & Resistance Area Marking Practice', 'August 10, 2026'),
('asg-ai', 'ai-automation', 'AI & Business Automation', 'ChatGPT Lead-Gen Workflow Make.com Setup Blueprint', 'August 15, 2026'),
('asg-web', 'web-dev', 'Web & Software Development', 'React Modular Dashboard Layout Build', 'August 20, 2026')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.announcements (id, title, content, category, date) VALUES
('ann-1', 'Forex Live Trading Starts Today', 'Join JPForex Mentor at 16:00 BST for our weekly live trade setup analysis. Link is available in the Live Class tab.', 'Academic', 'Today, 10:00 AM'),
('ann-2', 'AI Project Submission Deadline', 'All Make.com lead generation flows must be submitted before August 18. Deliverables require a loom link demo.', 'Alert', 'Yesterday')
ON CONFLICT (id) DO NOTHING;
