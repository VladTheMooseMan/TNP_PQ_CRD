// ============================================================
// FILE: src/lib/supabase.ts
// PURPOSE: Supabase client singleton.
// ------------------------------------------------------------
// ASCII FLOW:
//   env url+key -> createClient -> shared export
// ============================================================
import { createClient } from "@supabase/supabase-js";

const supabase_project_url_from_env = import.meta.env.VITE_SUPABASE_URL as string;
const supabase_anonymous_public_key_from_env = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase_client_singleton = createClient(
  supabase_project_url_from_env,
  supabase_anonymous_public_key_from_env,
  { auth: { persistSession: true, autoRefreshToken: true } }
);
