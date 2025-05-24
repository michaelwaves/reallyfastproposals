// app/api/auth/microsoft/callback/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const uid = searchParams.get("uid"); // optionally use a cookie to get UID

    if (!code) {
        return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    const tokenRes = await fetch(
        "https://login.microsoftonline.com/common/oauth2/v2.0/token",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: process.env.MICROSOFT_CLIENT_ID!,
                client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
                code,
                redirect_uri: process.env.MICROSOFT_REDIRECT_URI!,
                grant_type: "authorization_code",
            }),
        }
    );

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
        return NextResponse.json({ error: tokenData }, { status: 500 });
    }

    const { access_token, refresh_token, expires_in } = tokenData;
    console.log(tokenData)

    const res = NextResponse.redirect(new URL("/dashboard/settings", req.url));

    // Store access_token in a cookie (not HttpOnly so JS can read it on /settings)
    res.cookies.set("outlook_access_token", access_token, {
        path: "/",
        maxAge: expires_in, // usually 3600
        secure: true,
        sameSite: "lax",
    });

    // Optional: Store refresh_token in HttpOnly cookie if you plan to use it server-side
    res.cookies.set("outlook_refresh_token", refresh_token, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return res;
}
