'use server';

import { redirect } from 'next/navigation';
import { adminAuth } from './firebase-admin';
import {
    createSessionCookie,
    setSessionCookie,
    clearSessionCookie,
    getCurrentUser
} from './auth-helpers';

export async function signInAction(idToken: string) {
    try {
        // Verify the ID token first
        const decodedToken = await adminAuth.verifyIdToken(idToken);

        if (!decodedToken) {
            throw new Error('Invalid ID token');
        }

        // Create session cookie
        const sessionCookie = await createSessionCookie(idToken);

        // Set the session cookie
        await setSessionCookie(sessionCookie);

        return { success: true };
    } catch (error) {
        console.error('Sign in error:', error);
        return { success: false, error: 'Authentication failed' };
    }
}

export async function signOutAction() {
    try {
        const user = await getCurrentUser();

        if (user) {
            // Revoke all refresh tokens for the user
            await adminAuth.revokeRefreshTokens(user.uid);
        }

        // Clear the session cookie
        await clearSessionCookie();

        return { success: true };
    } catch (error) {
        console.error('Sign out error:', error);
        return { success: false, error: 'Sign out failed' };
    }
}
