//-| File path: lib/action.utils.ts

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
