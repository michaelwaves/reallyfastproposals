"use client";

import { Button } from "../ui/button";

export default function LoginToOutlook() {
    const handleLogin = () => {
        const clientId = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID!;
        const redirectUri = "http://localhost:3000/api/auth/"
        const tenant = "common"; // or your tenant id

        const url = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
            redirectUri
        )}&response_mode=query&scope=offline_access%20Mail.Read%20User.Read%20Mail.Send`;

        window.location.href = url;
    };

    return <Button onClick={handleLogin}>Sign in with Microsoft</Button>;
}
