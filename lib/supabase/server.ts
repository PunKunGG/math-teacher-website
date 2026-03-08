import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/supabase/env";

export function createSupabaseServerClient() {
  const { url, serviceRoleKey } = getSupabaseEnv();

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
