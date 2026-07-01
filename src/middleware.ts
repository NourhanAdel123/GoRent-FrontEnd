import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware to protect dashboard routes.
 *
 * Since the backend uses HTTP-only cookies for authentication,
 * the middleware checks for the presence of a "token" cookie.
 * If missing, the user is redirected to the login page.
 *
 * This is a fast, server-side first line of defense.
 * The dashboard layouts also perform a client-side auth check
 * as a fallback (in case the cookie exists but is expired/invalid).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for common auth cookie names
  const hasToken =
    request.cookies.has("token") || request.cookies.has("jwt");

  if (!hasToken) {
    const loginUrl = new URL("/auth/login", request.url);
    // Preserve the original URL so we can redirect back after login
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Only run middleware on dashboard routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
