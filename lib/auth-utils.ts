import { User } from "better-auth";
import { headers } from "next/headers";
import { auth, Session } from "./auth";
import { createRLSClient } from "./prisma-rls";

export async function getAuthenticatedClient(
  user?: User
): Promise<{
  db: ReturnType<typeof createRLSClient>;
  session: Session | null;
}> {
  // Get headers for server actions
  const headersList = await headers();

  // Better Auth validates session using AUTH_DATABASE_URL (privileged)
  const session = await auth.api.getSession({
    headers: headersList,
  });

  const userId = user?.id || session?.user.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Create RLS client with user context
  const db = createRLSClient(userId);

  return { db, session };
}
