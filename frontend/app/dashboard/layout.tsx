import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import GlobalNavBar from "@/components/navigation/GlobalNavBar";

function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-row w-full ">
            <GlobalNavBar />
            <div className="w-full h-screen overflow-scroll">
                <div className="max-w-7xl mx-auto">
                    <Breadcrumbs />
                    {children}
                </div>
            </div>
        </div>
    );
}

export default DashboardLayout;