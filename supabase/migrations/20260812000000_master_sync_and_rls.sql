-- Migration: Master Sync & RLS Policy Unification
-- Ensures seamless single-source-of-truth access for both Admin and Student portals.

-- 1. Profiles Table Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can select their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can access all profiles" ON public.profiles;

CREATE POLICY "Users can select their own profile" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can access all profiles" ON public.profiles 
  FOR ALL USING (
    (auth.jwt() ->> 'email') IN ('marvelousotugalu012@gmail.com', 'kolamarvelous725@gmail.com')
  );

-- 2. Courses Table Policies
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Courses are viewable by everyone" ON public.courses;
DROP POLICY IF EXISTS "Admins have full access to courses" ON public.courses;

CREATE POLICY "Courses are viewable by everyone" ON public.courses 
  FOR SELECT USING (true);

CREATE POLICY "Admins have full access to courses" ON public.courses 
  FOR ALL USING (
    (auth.jwt() ->> 'email') IN ('marvelousotugalu012@gmail.com', 'kolamarvelous725@gmail.com')
  );

-- 3. Course Lessons Table Policies
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Course lessons are viewable by everyone" ON public.course_lessons;
DROP POLICY IF EXISTS "Admins have full access to course_lessons" ON public.course_lessons;

CREATE POLICY "Course lessons are viewable by everyone" ON public.course_lessons 
  FOR SELECT USING (true);

CREATE POLICY "Admins have full access to course_lessons" ON public.course_lessons 
  FOR ALL USING (
    (auth.jwt() ->> 'email') IN ('marvelousotugalu012@gmail.com', 'kolamarvelous725@gmail.com')
  );

-- 4. Enrollments Table Policies
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can access their own enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Admins can view and edit student enrollments" ON public.enrollments;

CREATE POLICY "Users can access their own enrollments" ON public.enrollments 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view and edit student enrollments" ON public.enrollments 
  FOR ALL USING (
    (auth.jwt() ->> 'email') IN ('marvelousotugalu012@gmail.com', 'kolamarvelous725@gmail.com')
  );

-- 5. Lesson Progress Table Policies
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can access their own lesson progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Admins can view and edit student progress" ON public.lesson_progress;

CREATE POLICY "Users can access their own lesson progress" ON public.lesson_progress 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view and edit student progress" ON public.lesson_progress 
  FOR ALL USING (
    (auth.jwt() ->> 'email') IN ('marvelousotugalu012@gmail.com', 'kolamarvelous725@gmail.com')
  );

-- 6. Quizzes Table Policies
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can access their own quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Admins can view student quizzes" ON public.quizzes;

CREATE POLICY "Users can access their own quizzes" ON public.quizzes 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view student quizzes" ON public.quizzes 
  FOR ALL USING (
    (auth.jwt() ->> 'email') IN ('marvelousotugalu012@gmail.com', 'kolamarvelous725@gmail.com')
  );

-- 7. Assignments Table Policies
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Assignments are viewable by everyone" ON public.assignments;
DROP POLICY IF EXISTS "Admins have full access to assignments" ON public.assignments;

CREATE POLICY "Assignments are viewable by everyone" ON public.assignments 
  FOR SELECT USING (true);

CREATE POLICY "Admins have full access to assignments" ON public.assignments 
  FOR ALL USING (
    (auth.jwt() ->> 'email') IN ('marvelousotugalu012@gmail.com', 'kolamarvelous725@gmail.com')
  );

-- 8. Live Classes Table Policies
ALTER TABLE public.live_classes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Live classes are viewable by everyone" ON public.live_classes;
DROP POLICY IF EXISTS "Admins have full access to live classes" ON public.live_classes;

CREATE POLICY "Live classes are viewable by everyone" ON public.live_classes 
  FOR SELECT USING (true);

CREATE POLICY "Admins have full access to live classes" ON public.live_classes 
  FOR ALL USING (
    (auth.jwt() ->> 'email') IN ('marvelousotugalu012@gmail.com', 'kolamarvelous725@gmail.com')
  );

-- 9. Announcements Table Policies
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Announcements are viewable by everyone" ON public.announcements;
DROP POLICY IF EXISTS "Admins have full access to announcements" ON public.announcements;

CREATE POLICY "Announcements are viewable by everyone" ON public.announcements 
  FOR SELECT USING (true);

CREATE POLICY "Admins have full access to announcements" ON public.announcements 
  FOR ALL USING (
    (auth.jwt() ->> 'email') IN ('marvelousotugalu012@gmail.com', 'kolamarvelous725@gmail.com')
  );

-- 10. Messages Table Policies
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can access their own messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can view and send messages" ON public.messages;

CREATE POLICY "Users can access their own messages" ON public.messages 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view and send messages" ON public.messages 
  FOR ALL USING (
    (auth.jwt() ->> 'email') IN ('marvelousotugalu012@gmail.com', 'kolamarvelous725@gmail.com')
  );

-- 11. Certificates Table Policies
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can access their own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Admins can view and edit student certificates" ON public.certificates;

CREATE POLICY "Users can access their own certificates" ON public.certificates 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view and edit student certificates" ON public.certificates 
  FOR ALL USING (
    (auth.jwt() ->> 'email') IN ('marvelousotugalu012@gmail.com', 'kolamarvelous725@gmail.com')
  );

-- 12. Payments Table Policies
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can access their own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can view student payments" ON public.payments;

CREATE POLICY "Users can access their own payments" ON public.payments 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view student payments" ON public.payments 
  FOR ALL USING (
    (auth.jwt() ->> 'email') IN ('marvelousotugalu012@gmail.com', 'kolamarvelous725@gmail.com')
  );
