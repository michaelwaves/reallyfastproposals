import SettingsNavBar from "@/components/navigation/SettingsNavBar";

function SettingsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-4 w-full">
            <h1>Settings</h1>
            <SettingsNavBar />
            {children}
        </div>
    );
}

export default SettingsLayout;