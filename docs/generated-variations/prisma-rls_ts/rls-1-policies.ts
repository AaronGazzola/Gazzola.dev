export type RLSOperation = "SELECT" | "INSERT" | "UPDATE" | "DELETE" | "ALL";

export interface RLSPolicy {
  operation: RLSOperation;
  role: string;
  using: string;
}

export const PostRLS = {
  policies: [
    {
      operation: "SELECT",
      role: "user",
      using: `auth.uid() = user_id`
    },
    {
      operation: "SELECT",
      role: "admin",
      using: `true`
    }
  ],
};