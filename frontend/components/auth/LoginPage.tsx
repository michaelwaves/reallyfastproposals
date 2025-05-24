"use client";

import { LoginButton } from "./LoginButton";
import Image from "next/image";

function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-sky-50">
            {/* Image section for md+ */}
            <div className="hidden md:flex md:w-1/2 items-center justify-center bg-sky-100">
                <Image
                    src="/landing_page.jpg"
                    alt="Login Illustration"
                    className="max-w-md w-full h-auto object-cover"
                    width={1920}
                    height={1080}

                />
            </div>

            {/* Login form */}
            <div className="flex flex-1 items-center justify-center px-6 py-12">
                <div className="w-full max-w-md space-y-8 text-center">
                    <h1 className="text-4xl font-bold text-sky-700">Welcome Back</h1>
                    <p className="text-sky-600">Sign in to continue to your account</p>
                    <LoginButton />
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
