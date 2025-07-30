/**
 * Row Level Security (RLS) Utilities
 *
 * Helper functions for setting user context in database connections
 * to enable RLS policy enforcement.
 */

import { prisma } from "../lib/prisma-client";

/**
 * Set the current user context for RLS policies
 * This should be called at the beginning of server actions/API routes
 * after user authentication is verified.
 *
 * @param userId - The authenticated user's ID
 */
export async function setRLSContext(userId: string | null): Promise<void> {
  try {
    if (userId) {
      await prisma.$executeRaw`SELECT set_config('app.current_user_id', ${userId}, true)`;
    } else {
      // Clear the context if no user
      await prisma.$executeRaw`SELECT set_config('app.current_user_id', '', true)`;
    }
  } catch (error) {
    console.error("Failed to set RLS context:", error);
    // Don't throw - let the application continue with application-layer auth
  }
}

/**
 * Execute a database operation with user context set for RLS
 * This is a wrapper that ensures RLS context is set before operations.
 *
 * @param userId - The authenticated user's ID
 * @param operation - The database operation to execute
 */
export async function withRLSContext<T>(
  userId: string | null,
  operation: () => Promise<T>
): Promise<T> {
  await setRLSContext(userId);
  return operation();
}

/**
 * Middleware-style function to automatically set RLS context
 * from authenticated user. Use this in your server actions.
 *
 * @param getUser - Function that returns the authenticated user
 * @param operation - The database operation to execute
 */
export async function withAuthenticatedRLS<T>(
  getUser: () => Promise<{ id: string } | null>,
  operation: () => Promise<T>
): Promise<T> {
  const user = await getUser();
  return withRLSContext(user?.id || null, operation);
}

/**
 * Helper to check if RLS is properly configured
 * This can be used in health checks or startup validation
 */
export async function checkRLSConfiguration(): Promise<{
  isConfigured: boolean;
  error?: string;
}> {
  try {
    // Test if RLS functions exist in public schema
    const result = (await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.routines 
        WHERE routine_schema = 'public' 
        AND routine_name = 'current_user_id'
      ) as has_auth_function
    `) as [{ has_auth_function: boolean }];

    const hasAuthFunction = result[0]?.has_auth_function;

    if (!hasAuthFunction) {
      return {
        isConfigured: false,
        error: "RLS auth functions not found. Run the init_RLS migration.",
      };
    }

    // Test if RLS is enabled on key tables
    const rlsStatus = (await prisma.$queryRaw`
      SELECT 
        schemaname,
        tablename,
        rowsecurity
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('user', 'profile', 'contract', 'conversation', 'message')
    `) as Array<{
      schemaname: string;
      tablename: string;
      rowsecurity: boolean;
    }>;

    const tablesWithoutRLS = rlsStatus.filter((table) => !table.rowsecurity);

    if (tablesWithoutRLS.length > 0) {
      return {
        isConfigured: false,
        error: `RLS not enabled on tables: ${tablesWithoutRLS.map((t) => t.tablename).join(", ")}`,
      };
    }

    return { isConfigured: true };
  } catch (error: any) {
    return {
      isConfigured: false,
      error: `RLS configuration check failed: ${error.message}`,
    };
  }
}

/**
 * Get the current RLS context (for debugging/testing)
 */
export async function getCurrentRLSContext(): Promise<string | null> {
  try {
    const result = (await prisma.$queryRaw`
      SELECT current_setting('app.current_user_id', true) as current_user_id
    `) as [{ current_user_id: string | null }];

    return result[0]?.current_user_id || null;
  } catch (error) {
    console.error("Failed to get RLS context:", error);
    return null;
  }
}
