//-| File path: lib/action.utils.ts

import { User } from "@/generated/prisma";
import { withAuthenticatedRLS } from "@/lib/rls.utils";

export interface ActionResponse<T> {
  data?: T | null;
  error?: string | null;
}

export const getActionResponse = <T>({
  data,
  error,
}: {
  data?: T | null;
  error?: unknown;
}): ActionResponse<T> => {
  if (error) {
    const errorMessage =
      error instanceof Error
        ? error?.message
        : error?.toString() || "An unknown action error occurred";
    console.error("Action error:", errorMessage);
    return { data: null, error: errorMessage };
  }
  return { data: data ?? null, error: null };
};

/**
 * Wraps a server action with authentication and RLS context
 * Automatically handles user authentication and sets database-level security context
 *
 * @param action - The action function that receives user as first parameter
 * @returns Wrapped action with authentication and RLS context
 */
export function withAuthenticatedAction<TParams extends any[], TReturn>(
  action: (user: User | null, ...params: TParams) => Promise<TReturn>
) {
  return async (...params: TParams): Promise<TReturn> => {
    // Import getAuthenticatedUser dynamically to avoid circular dependency
    const { getAuthenticatedUser } = await import(
      "@/app/(actions)/app.actions"
    );

    return withAuthenticatedRLS(getAuthenticatedUser, async () => {
      const user = await getAuthenticatedUser();
      return action(user, ...params);
    });
  };
}
