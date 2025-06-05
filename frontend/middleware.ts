import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { nextUrl } = req;
    const { pathname } = nextUrl;

    // Redirect to /dashboard if logged in and visiting /
    if (req.auth && pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }

    // Redirect to /login if not logged in and accessing a protected route
    const isPublicRoute = ["/", "/login", "/signup"].includes(pathname);
    if (!req.auth && !isPublicRoute) {
        return NextResponse.redirect(new URL("/", nextUrl));
    }

    return NextResponse.next();
});
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
    runtime: "nodejs"
}