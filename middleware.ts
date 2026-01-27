import { type NextRequest, NextResponse } from "next/server";
import { parseDomain } from "@/lib/domain.utils";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const { brand, variant } = parseDomain(hostname);

  const response = NextResponse.next();

  if (request.cookies.get("domain-brand")?.value !== brand) {
    response.cookies.set("domain-brand", brand, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
    });
  }

  if (request.cookies.get("subdomain-variant")?.value !== variant) {
    response.cookies.set("subdomain-variant", variant, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
