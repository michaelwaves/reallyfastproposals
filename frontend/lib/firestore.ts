// lib/fetchers.ts
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function fetchUserOutlookData(uid: string) {
    if (!uid) throw new Error("No UID provided");

    const userDoc = await getDoc(doc(db, "users", uid));
    const data = userDoc.data();

    return {
        outlookEmail: data?.outlookEmail ?? null,
        outlookToken: data?.outlookToken ?? null,
    };
}
