//-| Filepath: src/middleware.ts
import configuration from "@/configuration";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAdminRoute =
    pathname.startsWith(configuration.paths.admin) ||
    pathname.startsWith("/chat");
  const isHome = pathname === "/";

  if (isAdminRoute && (!session || session.user.role !== "admin") && !isHome) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
};
