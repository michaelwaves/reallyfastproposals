// components/LoginWithFirebase.tsx
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "./FirebaseSessionProvider";
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";

export const LoginWithFirebase = () => {
    const { user } = useAuth();

    const handleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    const handleSignOut = async () => {
        await signOut(auth);
    };

    return (
        <Button
            onClick={user ? handleSignOut : handleSignIn}
            className=""
        >
            <LogIn /> {user ? "Sign Out" : "Sign In with Google"}
        </Button>
    );
};
