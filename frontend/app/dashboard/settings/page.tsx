import { auth } from "@/auth";
import SettingsForm from "@/components/forms/SettingsForm";
import { db } from "@/lib/postgres/db";

async function SettingsPage() {
    const session = await auth()
    const id = session?.user?.id
    const settingsData = await db.oneOrNone(`
        SELECT * 
        FROM settings
        WHERE userId=$1
        `, [id])
    return (

        <SettingsForm defaultValues={settingsData} />

    );
}

export default SettingsPage;