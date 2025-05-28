import { cookies } from 'next/headers';
import { adminAuth } from './firebase-admin';
import { DecodedIdToken } from 'firebase-admin/auth';

const SESSION_COOKIE_NAME = 'session';
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 5 * 1000; // 5 days

export interface SessionUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
}

/**
 * Custom helper to get session cookie since Firebase Admin SDK doesn't provide direct access
 */
export async function getSessionCookie(): Promise<string | null> {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
        return sessionCookie?.value || null;
    } catch (error) {
        console.error('Error getting session cookie:', error);
        return null;
    }
}

/**
 * Verify session cookie and return user data
 */
export async function verifySessionCookie(sessionCookie: string): Promise<DecodedIdToken | null> {
    try {
        const decodedClaim = await adminAuth.verifySessionCookie(sessionCookie, true);
        return decodedClaim;
    } catch (error) {
        console.error('Error verifying session cookie:', error);
        return null;
    }
}

/**
 * Get current authenticated user from session cookie
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
    try {
        const sessionCookie = await getSessionCookie();
        if (!sessionCookie) return null;

        const decodedClaim = await verifySessionCookie(sessionCookie);
        if (!decodedClaim) return null;

        return {
            uid: decodedClaim.uid,
            email: decodedClaim.email || null,
            displayName: decodedClaim.name || null,
            photoURL: decodedClaim.picture || null,
            emailVerified: decodedClaim.email_verified || false,
        };
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

/**
 * Create session cookie from ID token
 */
export async function createSessionCookie(idToken: string): Promise<string> {
    const expiresIn = SESSION_COOKIE_MAX_AGE;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    return sessionCookie;
}

/**
 * Set session cookie in response
 */
export async function setSessionCookie(sessionCookie: string) {
    const cookieStore = await cookies();
    cookieStore.set({
        name: SESSION_COOKIE_NAME,
        value: sessionCookie,
        maxAge: SESSION_COOKIE_MAX_AGE / 1000, // Convert to seconds
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });
}

/**
 * Clear session cookie
 */
export async function clearSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
}