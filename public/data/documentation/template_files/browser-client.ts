import { ENV, getBrowserAPI } from "@/lib/env.utils";
import type { Database } from "@/supabase/types";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient<Database>(
  ENV.SUPABASE_URL,
  ENV.SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: getBrowserAPI(() => localStorage),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);
