import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { ApiError } from "@/src/shared/errors/api-error";

let cachedClient: SupabaseClient | null = null;

function readEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new ApiError(500, "missing_env", `Missing required environment variable: ${name}.`);
  }

  return value;
}

export function getSupabaseServerClient(): SupabaseClient {
  if (cachedClient) {
    return cachedClient;
  }

  cachedClient = createClient(readEnv("SUPABASE_URL"), readEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedClient;
}
