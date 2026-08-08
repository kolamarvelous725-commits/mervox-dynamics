-- Migration Patch: Robust RLS Policies for Admin Access
-- This script ensures admins can manage courses, lessons, live classes, announcements, and student metrics based on both email and profiles role.

-- 1. profiles RLS policies
DROP POLICY IF EXISTS "Admins can access all profiles" ON public.profiles;
CREATE POLICY "Admins can access all profiles" ON public.profiles FOR ALL USING (
  (auth.jwt() ->> 'email') = 'marvelousotugalu012@gmail.com' OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 2. courses RLS policies
DROP POLICY IF EXISTS "Admins have full access to courses" ON public.courses;
CREATE POLICY "Admins have full access to courses" ON public.courses FOR ALL USING (
  (auth.jwt() ->> 'email') = 'marvelousotugalu012@gmail.com' OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 3. course_lessons RLS policies
DROP POLICY IF EXISTS "Admins have full access to course_lessons" ON public.course_lessons;
CREATE POLICY "Admins have full access to course_lessons" ON public.course_lessons FOR ALL USING (
  (auth.jwt() ->> 'email') = 'marvelousotugalu012@gmail.com' OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 4. enrollments RLS policies
DROP POLICY IF EXISTS "Admins can view and edit student enrollments" ON public.enrollments;
CREATE POLICY "Admins can view and edit student enrollments" ON public.enrollments FOR ALL USING (
  (auth.jwt() ->> 'email') = 'marvelousotugalu012@gmail.com' OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 5. progress RLS policies
DROP POLICY IF EXISTS "Admins can view and edit student progress" ON public.progress;
CREATE POLICY "Admins can view and edit student progress" ON public.progress FOR ALL USING (
  (auth.jwt() ->> 'email') = 'marvelousotugalu012@gmail.com' OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 6. live_classes RLS policies
DROP POLICY IF EXISTS "Admins have full access to live classes" ON public.live_classes;
CREATE POLICY "Admins have full access to live classes" ON public.live_classes FOR ALL USING (
  (auth.jwt() ->> 'email') = 'marvelousotugalu012@gmail.com' OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 7. announcements RLS policies
DROP POLICY IF EXISTS "Admins have full access to announcements" ON public.announcements;
CREATE POLICY "Admins have full access to announcements" ON public.announcements FOR ALL USING (
  (auth.jwt() ->> 'email') = 'marvelousotugalu012@gmail.com' OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 8. assignments RLS policies
DROP POLICY IF EXISTS "Admins have full access to assignments" ON public.assignments;
CREATE POLICY "Admins have full access to assignments" ON public.assignments FOR ALL USING (
  (auth.jwt() ->> 'email') = 'marvelousotugalu012@gmail.com' OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
