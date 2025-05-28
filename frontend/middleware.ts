import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from './lib/firebase-admin';

const protectedRoutes = ['/dashboard', '/profile', '/admin'];
const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get session cookie
    const sessionCookie = request.cookies.get('session')?.value;

    let isAuthenticated = false;

    if (sessionCookie) {
        try {
            await adminAuth.verifySessionCookie(sessionCookie, true);
            isAuthenticated = true;
        } catch (error) {
            // Session cookie is invalid, will be handled by clearing it
            console.error('Invalid session cookie:', error);
        }
    }

    // Redirect authenticated users away from auth pages
    if (isAuthenticated && authRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect unauthenticated users from protected routes
    if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
    runtime: "nodejs"
};