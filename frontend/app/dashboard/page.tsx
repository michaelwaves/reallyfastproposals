import { auth } from "@/auth";
import LinkCard from "@/components/navigation/LinkCard";
import { db } from "@/lib/postgres/db";
import { Settings } from "lucide-react";

async function DashboardPage() {
    const session = await auth();
    const settings = await db.oneOrNone(`
        SELECT *
        FROM settings
        WHERE userId=$1 
        `, [session?.user?.id])
    return (
        <div>
            <h1>Welcome {session?.user?.name}!</h1>
            <LinkCard href="/dashboard/settings" text="Settings" icon={<Settings />} />
        </div>
    );
}

export default DashboardPage;