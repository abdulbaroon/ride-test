import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware to handle authentication and URL path normalization.
 * 
 * This middleware performs the following tasks:
 * 1. Converts the URL path to lowercase for consistency.
 * 2. Checks for a valid authentication token in cookies to grant access to protected paths.
 * 3. Ensures the user has set up their profile if authenticated but the profile cookie is missing.
 * 4. Redirects to the login or profile setup page if necessary.
 * 
 * @param {NextRequest} request - The incoming request object.
 * @returns {NextResponse} The appropriate response based on the request's validity and user's authentication status.
 */
export function middleware(request: NextRequest): NextResponse {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("token");
    const userProfile = request.cookies.get("user");

    /**
     * Array of protected paths that require user authentication.
     * 
     * @constant {string[]}
     */
    const protectedPath: string[] = [
        "/ride/add",
        "/ride/edit",
        "/dashboard",
        "/points",
        "/account/profile",
        "/garminconnect",
        "/notification",
        "/calendar",
        "/rate",
        "/ridelog",
        "/rwgpsconnect",
        "/stravaconnect",
        "/explore",
        "/myfriends",
    ];

    // Convert the pathname to lowercase
    const lowercasePathname = pathname.toLowerCase();

    /**
     * Allow requests for static files by checking if the path ends with a file extension.
     * If the path points to a file, proceed without modification.
     * 
     * @returns {NextResponse} The next response to continue the request.
     */
    if (/\.[a-z0-9]+$/i.test(pathname)) {
        return NextResponse.next();
    }

    /**
     * Redirect to a lowercase version of the URL if the current path has uppercase letters.
     * 
     * @returns {NextResponse} A response redirecting to the lowercase URL.
     */
    if (pathname !== lowercasePathname) {
        const url = new URL(request.url);
        url.pathname = lowercasePathname;
        return NextResponse.redirect(url);
    }

    /**
     * Check if the current path is protected and requires a token. 
     * If the user is not authenticated (no token) and tries to access a protected path, redirect to the login page.
     * The return URL is included in the query string for after login redirection.
     * 
     * @returns {NextResponse} A response redirecting to the login page if authentication fails.
     */
    const isProtected = protectedPath.some((path) => pathname.startsWith(path));

    if (!token && isProtected) {
        return NextResponse.redirect(new URL(`/account/login?returnurl=${pathname}`, request.url));
    }

    /**
     * If the user is authenticated but has not set up their profile, redirect them to the profile setup page.
     * 
     * @returns {NextResponse} A response redirecting to the profile setup page if the profile is not set.
     */
    if (!userProfile && pathname !== "/account/profile" && token) {
        return NextResponse.redirect(new URL("/account/profile", request.url));
    }

    // Continue to the requested page if all checks pass
    return NextResponse.next();
}

/**
 * Configuration for the middleware, specifying the paths it should match.
 * This matcher applies the middleware to all paths.
 * 
 * @constant {object}
 * @property {string[]} matcher - The paths to which the middleware applies.
 */
export const config = {
    matcher: ["/:path*"],
};
