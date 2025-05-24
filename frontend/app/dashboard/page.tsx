"use client"

import { useAuth } from "@/components/auth/FirebaseSessionProvider";

function DashboardPage() {
    const { user } = useAuth()
    return (
        <div>
            <div>
                <h1>Hello {user?.displayName}</h1>
                Welcome to your RFP dashboard
            </div>
        </div>
    );
}

export default DashboardPage;