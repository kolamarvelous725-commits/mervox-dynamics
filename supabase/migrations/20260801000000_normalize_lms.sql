-- Migration: Normalize Course Lessons and Progress Tracking

-- 1. Clean up old redundant arrays in courses table if they exist
ALTER TABLE public.courses DROP COLUMN IF EXISTS lessons;
ALTER TABLE public.courses DROP COLUMN IF EXISTS total_lessons;
ALTER TABLE public.courses DROP COLUMN IF EXISTS videos;
ALTER TABLE public.courses DROP COLUMN IF EXISTS pdfs;

-- 2. Create course_lessons table
CREATE TABLE IF NOT EXISTS public.course_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT,
    pdf_url TEXT,
    duration TEXT,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create lesson_progress table
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, lesson_id)
);

-- 4. Enable Row Level Security
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- 5. Establish RLS Policies
-- course_lessons
DROP POLICY IF EXISTS "Course lessons are viewable by everyone" ON public.course_lessons;
CREATE POLICY "Course lessons are viewable by everyone" ON public.course_lessons FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins have full access to course_lessons" ON public.course_lessons;
CREATE POLICY "Admins have full access to course_lessons" ON public.course_lessons FOR ALL USING (public.is_admin());

-- lesson_progress
DROP POLICY IF EXISTS "Users can view and edit their own lesson_progress" ON public.lesson_progress;
CREATE POLICY "Users can view and edit their own lesson_progress" ON public.lesson_progress FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all lesson_progress" ON public.lesson_progress;
CREATE POLICY "Admins can view all lesson_progress" ON public.lesson_progress FOR ALL USING (public.is_admin());

-- 6. Add to Realtime replication
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.course_lessons;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.lesson_progress;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END
$$;

-- 7. Seed default 20 lessons per default course dynamically
DO $$
DECLARE
  c_id TEXT;
  i INTEGER;
  course_title TEXT;
BEGIN
  FOR c_id IN SELECT id FROM public.courses LOOP
    IF NOT EXISTS (SELECT 1 FROM public.course_lessons WHERE course_id = c_id) THEN
      IF c_id = 'forex-trading' THEN
        course_title := 'Technical Analysis & Market Structures';
      ELSIF c_id = 'ai-automation' THEN
        course_title := 'AI Automation & Trigger Funnels';
      ELSIF c_id = 'web-dev' THEN
        course_title := 'React Components & NextJS APIs';
      ELSE
        course_title := 'YouTube Niches & SEO Mechanics';
      END IF;
      
      FOR i IN 1..20 LOOP
        INSERT INTO public.course_lessons (course_id, title, sort_order)
        VALUES (c_id, course_title || ' - Part ' || i, i);
      END LOOP;
    END IF;
  END LOOP;
END;
$$;
