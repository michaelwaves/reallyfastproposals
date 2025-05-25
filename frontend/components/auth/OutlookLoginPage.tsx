"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useAuth } from "@/components/auth/FirebaseSessionProvider";
import LoginToOutlook from "@/components/auth/LoginToOutlook";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { MailCheck, ShieldCheck } from "lucide-react";

function OutlookLoginPage() {
    const { user } = useAuth();

    const [email, setEmail] = useState("");
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        const token = Cookies.get("outlook_access_token");
        setHasToken(!!token);
    }, []);

    const handleStoreToken = async () => {
        const token = Cookies.get("outlook_access_token");

        if (!token) {
            toast.error("No outlook_access_token found. Please sign in with Microsoft first");
            return;
        }

        try {
            // Fetch email using Microsoft Graph API
            const res = await fetch("https://graph.microsoft.com/v1.0/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            const email = data.mail || data.userPrincipalName; // fallback if 'mail' is null

            if (!email) {
                toast.error("Failed to retrieve email from Microsoft");
                return;
            }

            await setDoc(
                doc(db, "users", user?.uid ?? ""),
                {
                    outlookToken: token,
                    outlookEmail: email,
                },
                { merge: true }
            );

            toast.success("Successfully linked Outlook account!");
            window.location.reload()
        } catch (error) {
            console.error(error);
            toast.error("Failed to store Outlook token.");
        }
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-sky-50 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full space-y-6">
                <h1 className="text-2xl font-bold text-center text-sky-700 flex items-center justify-center gap-2">
                    <MailCheck className="w-6 h-6" />
                    Outlook Settings
                </h1>

                {!hasToken ? (
                    <>
                        {/* <div>
                            <label className="text-sm text-sky-700">Your Outlook Email</label>
                            <Input
                                placeholder="you@outlook.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1"
                            />
                        </div> */}
                        <div className="w-full flex items-center justify-center">
                            <LoginToOutlook />
                        </div>

                        <p className="text-sm text-gray-500 text-center">
                            We’ll redirect you to Microsoft to connect your account securely.
                        </p>
                    </>
                ) : (
                    <div className="space-y-4 text-center">
                        <div className="flex flex-col items-center justify-center text-sky-700">
                            <ShieldCheck className="w-10 h-10 mb-2" />
                            <h2 className="text-lg font-semibold">Microsoft access token detected</h2>
                            <p className="text-sm text-gray-600">
                                We’ve received your credentials from Microsoft. Please confirm to link your Outlook account.
                            </p>
                        </div>

                        <Button onClick={handleStoreToken} className="w-full">
                            Confirm Outlook Connection
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OutlookLoginPage;
