export async function getFolderId(accessToken: string, folderName: string): Promise<string | null> {
    const res = await fetch("https://graph.microsoft.com/v1.0/me/mailFolders", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) {
        console.error("Failed to fetch mail folders");
        return null;
    }

    const data = await res.json();
    const folder = data.value.find((f: any) => f.displayName === folderName);
    return folder?.id ?? null;
}
