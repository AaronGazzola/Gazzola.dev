const isBrowser = typeof window !== "undefined";

export const ENV = {
  SUPABASE_URL: isBrowser
    ? process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    : process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  SUPABASE_KEY: isBrowser
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || "",
  MODE: process.env.NODE_ENV || "production",
  DEV: process.env.NODE_ENV === "development",
};

export function getBrowserAPI<T>(accessor: () => T): T | undefined {
  return isBrowser ? accessor() : undefined;
}
