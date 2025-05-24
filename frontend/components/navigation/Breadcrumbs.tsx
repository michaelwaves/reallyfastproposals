"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean)

    return (
        <div className="py-4 bg-white">
            <nav className="text-sm text-gray-600">
                <ul className="flex items-center space-x-2">
                    {segments.map((segment, index) => {
                        const href = "/" + segments.slice(0, index + 1).join("/");
                        const isLast = index === segments.length - 1;

                        return (
                            <li key={href} className="flex items-center space-x-2">
                                {segment != "dashboard" && <ChevronRight className="h-4 w-4 text-gray-400" />}
                                <Link
                                    href={href}
                                    className={isLast ? "text-gray-900 font-medium" : "hover:text-gray-900"}
                                >
                                    {decodeURIComponent(segment)
                                        .replace(/-/g, " ") // Convert hyphens to spaces
                                        .replace(/\b\w/g, (char) => char.toUpperCase())} {/* Capitalize words */}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}