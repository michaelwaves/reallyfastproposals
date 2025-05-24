"use client";

import { useAuth } from "@/components/auth/FirebaseSessionProvider";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { Mail, EyeOff, Trash2 } from "lucide-react";

function maskToken(token: string): string {
    return token.slice(0, 6) + "..." + token.slice(-4);
}

interface OutlookConnectedPageProps {
    outlookEmail: string;
    outlookToken: string;
    onDisconnect: () => void;
}

function OutlookConnectedPage({ outlookEmail, outlookToken, onDisconnect }: OutlookConnectedPageProps) {
    const { user } = useAuth();

    const handleDisconnect = async () => {
        if (!user?.uid) return;

        try {
            await updateDoc(doc(db, "users", user.uid), {
                outlookEmail: "",
                outlookToken: "",
            });

            Cookies.remove("outlook_access_token");
            Cookies.remove("outlook_refresh_token");

            toast.success("Outlook disconnected.");
            onDisconnect();
        } catch (error) {
            toast.error("Failed to disconnect Outlook.");
            console.error(error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-sky-50 px-4">
            <Card className="w-full max-w-md p-6 space-y-6 shadow-xl">
                <h1 className="text-xl font-bold text-sky-700 flex items-center gap-2">
                    <Mail className="w-5 h-5" /> Outlook Account Linked
                </h1>

                <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="text-md font-medium text-gray-800">{outlookEmail}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500 mb-1">Access Token</p>
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-gray-700 text-sm">{maskToken(outlookToken)}</span>
                        <EyeOff className="w-4 h-4 text-gray-400" />
                    </div>
                </div>

                <Button onClick={handleDisconnect} variant="destructive" className="w-full flex gap-2">
                    <Trash2 className="w-4 h-4" />
                    Disconnect Outlook
                </Button>
            </Card>
        </div>
    );
}

export default OutlookConnectedPage;
