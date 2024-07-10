import { NextRequest, NextResponse } from "next/server";
export function middleware(request:NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/account/login", request.url));
  }
}
export const config = {
  matcher: ["/activities/add", "/account/profile","/dashboard"],
};