import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "mirrorstock_session";

// Edge middleware can't use the Node "crypto" module the same way route
// handlers can, so this only checks that a session cookie is present, not
// that its signature is still valid - full verification happens again in
// each protected API route via verifySessionCookieValue(). This is enough to
// keep casual visitors out of /dashboard; it is not the security boundary.
export function proxy(request: NextRequest) {
  const hasSession = Boolean(request.cookies.get(COOKIE_NAME)?.value);

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
