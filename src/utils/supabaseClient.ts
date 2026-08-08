import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isPlaceholder =
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl.includes("your-project-id") ||
  supabaseAnonKey.includes("your-anon-key");

if (isPlaceholder) {
  console.warn("Supabase credentials missing or set to placeholder. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local. The application is running in local sandbox/offline mode.");
}

const safeUrl = isPlaceholder ? "https://placeholder-project.supabase.co" : supabaseUrl;
const safeKey = isPlaceholder ? "placeholder-anon-key" : supabaseAnonKey;

export const supabase = createClient(safeUrl, safeKey);
export const isSupabaseConfigured = !isPlaceholder;
