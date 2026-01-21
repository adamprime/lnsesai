import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client with service role key
// Use this for admin operations that need full access
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

  return createClient(supabaseUrl, supabaseServiceKey);
}
