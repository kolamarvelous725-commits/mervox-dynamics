-- Migration: Align schema cache columns for live_classes and courses

-- 1. Add description to live_classes
ALTER TABLE public.live_classes ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';

-- 2. Add videos and pdfs to courses
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS videos JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS pdfs JSONB DEFAULT '[]'::jsonb;
