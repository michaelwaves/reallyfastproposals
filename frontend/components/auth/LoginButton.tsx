"use client"
import { signIn } from "next-auth/react";
import GoogleButton from "react-google-button";

function LoginButton() {
    return (
        <GoogleButton
            onClick={() => signIn("google")} />
    );
}

export default LoginButton;