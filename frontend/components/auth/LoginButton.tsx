// components/LoginWithFirebase.tsx
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "./FirebaseSessionProvider";
import { Button } from "../ui/button";
import { LogIn, LogOut } from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInAction, signOutAction } from "@/lib/auth-actions";
import { useRouter } from "next/navigation";

export const LoginButton = ({ collapsed }: { collapsed?: boolean }) => {
    const { user } = useAuth();
    const router = useRouter();

    const handleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        const firebaseUser = result.user;
        const uid = firebaseUser.uid;
        const displayName = firebaseUser.displayName ?? "";
        const email = firebaseUser.email ?? "";

        const idToken = await firebaseUser.getIdToken();
        const serverSignInResult = await signInAction(idToken)

        //force middleware to rerun
        if (serverSignInResult.success) {
            router.push('/dashboard');
            router.refresh();
        }

        const [firstName = "", lastName = ""] = displayName.split(" ");

        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                firstName,
                lastName,
                email,
                createdAt: new Date().toISOString(),
            });
        }
    };

    const handleSignOut = async () => {
        await signOut(auth);
        await signOutAction()
        router.push('/dashboard');
    };

    return (
        <>
            {user ?
                <Button onClick={handleSignOut}> <LogOut /> {!collapsed && "Sign Out"}</Button> :
                <Button onClick={handleSignIn}> <LogIn /> {!collapsed && "Sign In with Google"}</Button>
            }
        </>
    );
};
