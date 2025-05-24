"use client"

import { useAuth } from "@/components/auth/FirebaseSessionProvider";
import Emails from "./Emails";

function DashboardPage() {
    const { user } = useAuth()
    return (
        <div>
            <div>
                <h1>Hello {user?.displayName}</h1>
                Welcome to your RFP dashboard
                <Emails />
            </div>
        </div>
    );
}

export default DashboardPage;