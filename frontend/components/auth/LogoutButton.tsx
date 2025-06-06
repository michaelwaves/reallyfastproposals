"use client"
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";

function LogoutButton({ collapsed }: { collapsed?: boolean }) {
    return (
        <Button onClick={() => signOut()}>
            <LogOut /> {!collapsed && "Log Out"}
        </Button>
    );
}

export default LogoutButton;