"use client"

import { useAuth } from "@/components/auth/FirebaseSessionProvider";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

function SettingsPage() {

    const { user } = useAuth();
    const handleEditUser = async () => {
        await setDoc(doc(db, "users", user?.uid ?? ""),
            { outlookToken: "123" },
            { merge: true }
        )
    }
    return (
        <div>
            <h1>Settings</h1>

        </div>
    );
}

export default SettingsPage;