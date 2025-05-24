"use client"
import Link from "next/link";
import { ChevronLeft, ChevronRight, HomeIcon, NotebookText, Settings, } from "lucide-react";
import Image from "next/image";
import logo from '@/public/logo.png'
import { LoginButton } from "../auth/LoginButton";
import { useState } from "react";
import { CustomTooltip } from "../info/CustomTooltip";

interface NavbarLinkProps {
    title: string | undefined,
    href: string | undefined,
    icon: React.ReactNode,
    collapsed: boolean
}

const links: Partial<NavbarLinkProps>[] = [
    {
        title: "Home",
        href: "/",
        icon: <HomeIcon size={20} />
    },
    {
        title: "RFPs",
        href: "/rfps",
        icon: <NotebookText size={20} />
    },
    {
        title: "Settings",
        href: "/settings",
        icon: <Settings size={20} />
    },
]

function NavbarElement({ title, href, icon, collapsed }: NavbarLinkProps) {
    return (

        <div className="rounded-lg hover:bg-gray-200 px-2 py-2" >
            {collapsed ? <CustomTooltip description={title ?? ""}>
                <Link href={`/dashboard/${href}`} className="flex flex-row items-center justify-center">
                    {icon}
                </Link>
            </CustomTooltip> :
                <Link href={`/dashboard/${href}`} className="flex flex-row items-center">
                    {icon}
                    <span className=" text-sm pl-2">
                        {title}
                    </span>
                </Link>
            }
        </div>

    )
}
function Navbar() {
    const [collapsed, setCollapsed] = useState<boolean>(false)
    return (
        <div className="flex flex-row">
            <div className={`${collapsed ? "w-[70px]" : "w-[20vw]"}
                max-w-[200px] bg-white min-h-screen h-full p-2 border-r-8 border-[#f7f4ed] flex justify-between flex-col`}>
                <div>
                    <div className="py-4 px-1 pt-5">
                        <Image
                            src={logo}
                            alt="Logo"
                            width={100}
                            height={40}
                            className=''
                        />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        {links.map((link) => (<NavbarElement
                            key={link.href}
                            title={link.title}
                            href={link.href}
                            collapsed={collapsed}
                            icon={link.icon} />
                        ))}
                    </div>
                </div>
                <div className="w-full h-20 flex items-center">
                    <LoginButton collapsed={collapsed} />
                </div>
            </div>
            <div className="flex items-center h-full">
                <CustomTooltip description={collapsed ? "Expand" : "Collapse"}>
                    <div
                        onClick={() => setCollapsed(!collapsed)}
                        className="relative w-6 h-6 flex items-center justify-center group cursor-pointer">
                        <div className="absolute w-[2px] h-5 bg-gray-500 transition-all duration-300 ease-in-out group-hover:opacity-0 group-hover:scale-0" />
                        {
                            collapsed ?
                                <ChevronRight className="absolute w-5 h-5 text-gray-500 opacity-0 scale-0 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:scale-100" />
                                :
                                <ChevronLeft className="absolute w-5 h-5 text-gray-500 opacity-0 scale-0 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:scale-100" />
                        }
                    </div>
                </CustomTooltip>
            </div>
        </div>
    );
}

export default Navbar;