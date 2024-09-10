import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token");
  const userProfile = request.cookies.get("user");

  // Convert the pathname to lowercase
  const lowercasePathname = pathname.toLowerCase();

  if (pathname !== lowercasePathname) {
    const url = new URL(request.url);
    url.pathname = lowercasePathname;
    return NextResponse.redirect(url);
  }

  // If no token is found, redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL("/account/login", request.url));
  }

  if (userProfile?.value === "null" && pathname !== "/account/profile") {
    return NextResponse.redirect(new URL("/account/profile", request.url));
  }

  // Continue to the requested page
  return NextResponse.next();
}

export const config = {
  matcher: ["/ride/:path*", "/account/profile", "/dashboard"],
};
