import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token");
  const userProfile = request.cookies.get("user");
  const protectedPath = [
    "/ride/add",
    "/ride/edit", 
    "/dashboard",
    "/points",
    "/account/profile",
    "/garminconnect",
    "/notification",
    "/points",
    "/rate",
    "/ridelog",
    "/rwgpsconnect",
    "/stravaconnect",
    "/explore",
    "/myfriends"
  ];

  // Convert the pathname to lowercase
  const lowercasePathname = pathname.toLowerCase();
  if (/\.[a-z0-9]+$/i.test(pathname)) {
    return NextResponse.next();
  }

  // Redirect if pathname is not in lowercase
  if (pathname !== lowercasePathname) {
    const url = new URL(request.url);
    url.pathname = lowercasePathname;
    return NextResponse.redirect(url);
  }
  
  // If no token is found and the path is protected, redirect to login
  const isProtected = protectedPath.some((path) =>
    pathname.startsWith(path)
);

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/account/login", request.url));
  }

  // If userProfile is null or undefined, redirect to profile setup page
  // if (!userProfile && pathname !== "/account/profile") {
  //   return NextResponse.redirect(new URL("/account/profile", request.url));
  // }

  // Continue to the requested page
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
