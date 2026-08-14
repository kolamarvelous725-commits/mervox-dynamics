-- Migration: Add course_id column to public.payments
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS course_id TEXT REFERENCES public.courses(id) ON DELETE SET NULL;
