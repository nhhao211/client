import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/documents", "/projects", "/editor", "/settings"];
const authRoutes = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const { pathname } = request.nextUrl;

  // Check if trying to access protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  
  if (isProtectedRoute && !token) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    // response.cookies.delete("authToken"); // Clean up if invalid? No, just redirect.
    return response;
  }

  // Check if trying to access auth route while logged in
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  
  if (isAuthRoute && token) {
     return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder content if any
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
