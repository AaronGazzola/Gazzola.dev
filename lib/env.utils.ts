const isBrowser = typeof window !== "undefined";

export const ENV = {
  SUPABASE_URL: isBrowser
    ? process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    : process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  SUPABASE_KEY: isBrowser
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
};

export function getBrowserAPI<T>(accessor: () => T): T | undefined {
  return isBrowser ? accessor() : undefined;
}
