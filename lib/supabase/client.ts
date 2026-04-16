import { createClient as _createClient } from "@supabase/supabase-js";

// Singleton client — one instance shared for the app's lifetime.
// Auth is fully disabled: no session storage, no token refresh, no session
// detection from the URL. Without these, the client is a pure database
// client and won't hang on iOS Safari's stricter storage/cookie policies.
let client: ReturnType<typeof _createClient> | null = null;

export function createClient() {
  if (!client) {
    client = _createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );
  }
  return client;
}
