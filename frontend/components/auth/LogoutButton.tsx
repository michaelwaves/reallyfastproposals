"use client"
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";

function LogoutButton() {
    return (
        <Button onClick={() => signOut()}>
            <LogOut /> Log Out
        </Button>
    );
}

export default LogoutButton;