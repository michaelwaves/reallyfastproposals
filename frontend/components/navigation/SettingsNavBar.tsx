"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"

export default function SettingsNavBar() {
    const pathname = usePathname()

    return (
        <nav className="flex flex-row gap-4">
            <Link
                href="/dashboard/settings"
                className={clsx(
                    "px-2 py-1 rounded-t-lg border",
                    pathname === "/dashboard/settings" ? "bg-lime-100 border-lime-500 text-lime-700" : "border-transparent"
                )}
            >
                RFP Settings
            </Link>
            <Link
                href="/dashboard/settings/user"
                className={clsx(
                    "px-2 py-1 rounded-t-lg border",
                    pathname === "/dashboard/settings/user" ? "bg-lime-100 border-lime-500 text-lime-700" : "border-transparent"
                )}
            >
                User Settings
            </Link>
        </nav>
    )
}
