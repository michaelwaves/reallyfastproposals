import { auth } from "@/auth";
import LogoutButton from "@/components/auth/LogoutButton";

async function DashboardPage() {
    const session = await auth();
    return (
        <div>
            Dashboard
            <div>
                {JSON.stringify(session)}
            </div>
            <LogoutButton />
        </div>
    );
}

export default DashboardPage;