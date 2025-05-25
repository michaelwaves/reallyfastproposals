"use client"

import { useAuth } from "@/components/auth/FirebaseSessionProvider";
import { DataTable } from "@/components/table/datatable";
import { fetchUserOutlookData } from "@/lib/firestore";
import { getEmailsFromNamedFolder } from "@/lib/outlook";
import { useEffect, useState } from "react";
import { messageColumns } from "./columns";
import { Loader } from "lucide-react";

function Emails() {
    const [emails, setEmails] = useState(null)
    const [token, setToken] = useState(null)
    const { user } = useAuth();
    useEffect(() => {
        const getOutlookData = async () => {
            if (user) {
                const res = await fetchUserOutlookData(user?.uid)
                setToken(res.outlookToken)
            }

        }
        const getEmails = async () => {
            if (token) {
                const emails = await getEmailsFromNamedFolder(token, "proposals")
                setEmails(emails)
            }
        }
        getOutlookData()
        getEmails()
    }, [user, token])
    return (
        <div>
            {emails ? <DataTable data={emails} columns={messageColumns} /> : <Loader className="animate-spin" />}
        </div>
    );
}

export default Emails;