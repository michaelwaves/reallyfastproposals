// components/LoginWithFirebase.tsx
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "./FirebaseSessionProvider";
import { Button } from "../ui/button";
import { LogIn, LogOut } from "lucide-react";

export const LoginButton = () => {
    const { user } = useAuth();

    const handleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    const handleSignOut = async () => {
        await signOut(auth);
    };

    return (
        <>
            {user ?
                <Button onClick={handleSignOut}> <LogOut /> Sign Out</Button> :
                <Button onClick={handleSignIn}> <LogIn /> Sign In with Google</Button>
            }
        </>
    );
};
