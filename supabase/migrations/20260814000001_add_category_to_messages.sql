-- Migration: Add category column to messages
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'General';
