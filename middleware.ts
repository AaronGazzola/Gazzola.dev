import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const subdomain = hostname.split(".")[0];
  const variant = subdomain === "az" ? "az" : "default";

  const response = NextResponse.next();

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
