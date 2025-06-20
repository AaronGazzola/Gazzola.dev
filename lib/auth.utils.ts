//-| Filepath: lib/auth.utils.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user || null;
}

export async function getOptionalUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return session?.user || null;
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getOptionalUser();

  if (!user) {
    redirect("/sign-in");
  }

  return user;
}
