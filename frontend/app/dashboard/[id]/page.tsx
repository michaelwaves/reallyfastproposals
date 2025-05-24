"use client"

import { useAuth } from "@/components/auth/FirebaseSessionProvider";
import { DataTable } from "@/components/table/datatable";
import { extractLinksFromHTML } from "@/lib/cheerio";
import { fetchUserOutlookData } from "@/lib/firestore";
import { getMessageById } from "@/lib/outlook";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function EmailPage() {
    const { id } = useParams();
    const [email, setEmail] = useState(null)
    const [token, setToken] = useState(null)
    const [links, setLinks] = useState<any>([])
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
                const emailLinkData = await extractLinksFromHTML(emails.body.content)
                setLinks(emailLinkData)
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
            {links &&
                <DataTable data={links} />
            }
        </div>
    );
}

export default EmailPage;