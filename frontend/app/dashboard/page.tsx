"use client"

import { useAuth } from "@/components/auth/FirebaseSessionProvider";
import SearchForm from "./SearchForm";

function DashboardPage() {
    const { user } = useAuth()
    return (
        <div className="min-h-screen bg-sky-50 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-sky-100">
                <div>
                    <h1 className="text-3xl font-bold text-sky-800 mb-2">Hello {user?.displayName}</h1>
                    <p className="text-sky-700 text-lg">Welcome to your RFP dashboard</p>
                </div>

                <div className="pt-4">
                    <SearchForm />
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;