"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/FirebaseSessionProvider";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Loader } from "lucide-react";
import OutlookLoginPage from "@/components/auth/OutlookLoginPage";
import OutlookConnectedPage from "@/components/auth/OutlookConnectedPage";

function SettingsPage() {
    const { user } = useAuth();
    const [outlookEmail, setOutlookEmail] = useState<string | null>(null);
    const [outlookToken, setOutlookToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOutlookDetails = async () => {
            if (!user?.uid) {
                setLoading(false);
                return;
            }

            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                const data = userDoc.data();

                if (data?.outlookEmail && data?.outlookToken) {
                    setOutlookEmail(data.outlookEmail);
                    setOutlookToken(data.outlookToken);
                }
            } catch (error) {
                console.error("Error fetching Outlook data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOutlookDetails();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-sky-600">
                <Loader className="animate-spin mr-2" />
                Loading settings...
            </div>
        );
    }

    const hasOutlook = !!outlookEmail && !!outlookToken;
    return (
        <div className="min-h-screen bg-sky-50 p-6">
            {hasOutlook ? <OutlookConnectedPage
                outlookEmail={outlookEmail}
                outlookToken={outlookToken}
                onDisconnect={() => {
                    setOutlookEmail(null);
                    setOutlookToken(null);
                }}
            /> : <OutlookLoginPage />}
        </div>
    );
}

export default SettingsPage;
