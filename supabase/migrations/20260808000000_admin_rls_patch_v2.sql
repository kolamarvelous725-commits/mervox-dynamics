-- Migration: Admin RLS Patch Version 2
-- Grants full admin permissions to both designated admin accounts (marvelousotugalu012@gmail.com and kolamarvelous725@gmail.com).

-- 1. profiles table
DROP POLICY IF EXISTS "Admins can access all profiles" ON public.profiles;
CREATE POLICY "Admins can access all profiles" ON public.profiles FOR ALL USING (
  (auth.jwt() ->> 'email') IN ('marvelousotugalu012@gmail.com', 'kolamarvelous725@gmail.com')
);

-- 2. courses table
DROP POLICY IF EXISTS "Admins have full access to courses" ON public.courses;
CREATE POLICY "Admins have full access to courses" ON public.courses FOR ALL USING (
  (auth.jwt() ->> 'email') IN ('marvelousotugalu012@gmail.com', 'kolamarvelous725@gmail.com')
);

-- 3. course_lessons table
DROP POLICY IF EXISTS "Admins have full access to course_lessons" ON public.course_lessons;
CREATE POLICY "Admins have full access to course_lessons" ON public.course_lessons FOR ALL USING (
  (auth.jwt() ->> 'email') IN ('marvelousotugalu012@gmail.com', 'kolamarvelous725@gmail.com')
);

-- 4. enrollments table
DROP POLICY IF EXISTS "Admins can view and edit student enrollments" ON public.enrollments;
CREATE POLICY "Admins can view and edit student enrollments" ON public.enrollments FOR ALL USING (
  (auth.jwt() ->> 'email') IN ('marvelousotugalu012@gmail.com', 'kolamarvelous725@gmail.com')
);

-- 5. progress table
DROP POLICY IF EXISTS "Admins can view and edit student progress" ON public.progress;
CREATE POLICY "Admins can view and edit student progress" ON public.progress FOR ALL USING (
  (auth.jwt() ->> 'email') IN ('marvelousotugalu012@gmail.com', 'kolamarvelous725@gmail.com')
);

-- 6. live_classes table
DROP POLICY IF EXISTS "Admins have full access to live classes" ON public.live_classes;
CREATE POLICY "Admins have full access to live classes" ON public.live_classes FOR ALL USING (
  (auth.jwt() ->> 'email') IN ('marvelousotugalu012@gmail.com', 'kolamarvelous725@gmail.com')
);

-- 7. announcements table
DROP POLICY IF EXISTS "Admins have full access to announcements" ON public.announcements;
CREATE POLICY "Admins have full access to announcements" ON public.announcements FOR ALL USING (
  (auth.jwt() ->> 'email') IN ('marvelousotugalu012@gmail.com', 'kolamarvelous725@gmail.com')
);

-- 8. assignments table
DROP POLICY IF EXISTS "Admins have full access to assignments" ON public.assignments;
CREATE POLICY "Admins have full access to assignments" ON public.assignments FOR ALL USING (
  (auth.jwt() ->> 'email') IN ('marvelousotugalu012@gmail.com', 'kolamarvelous725@gmail.com')
);
