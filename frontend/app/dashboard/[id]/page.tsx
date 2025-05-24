"use client"

import { useAuth } from "@/components/auth/FirebaseSessionProvider";
import { fetchUserOutlookData } from "@/lib/firestore";
import { getMessageById } from "@/lib/outlook";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function EmailPage() {
    const { id } = useParams();
    const [email, setEmail] = useState(null)
    const [token, setToken] = useState(null)
    const { user } = useAuth();
    useEffect(() => {
        const getOutlookData = async () => {
            if (user) {
                const res = await fetchUserOutlookData(user?.uid)
                setToken(res.outlookToken)
            }

        }
        const getEmail = async () => {
            if (token) {
                const emails = await getMessageById(token, String(id))
                setEmail(emails)
            }
        }
        getOutlookData()
        getEmail()
    }, [user, token])
    return (
        <div>

            {email &&
                //@ts-expect-error description:email.body exists
                <div dangerouslySetInnerHTML={{ __html: email.body.content }} />}
        </div>
    );
}

export default EmailPage;