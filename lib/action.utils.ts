//-| File path: lib/action.utils.ts
import { ActionResponse } from "@/app/(types)/ui.types";

export const getActionResponse = <T>({
  data,
  error,
}: {
  data?: T | null;
  error?: any;
}): ActionResponse<T> => {
  if (error) {
    const errorMessage =
      error?.message || error?.toString() || "An unknown error occurred";
    console.error("Action error:", errorMessage);
    return { data: null, error: errorMessage };
  }
  return { data: data ?? null, error: null };
};
