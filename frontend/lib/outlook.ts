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


export async function getEmailsFromFolder(accessToken: string, folderId: string) {
    const res = await fetch(`https://graph.microsoft.com/v1.0/me/mailFolders/${folderId}/messages?$top=25`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) {
        console.error("Failed to fetch messages");
        return [];
    }

    const data = await res.json();
    return data.value; // Array of message objects
}

export async function getEmailsFromNamedFolder(accessToken: string, folderName: string) {
    const folderId = await getFolderId(accessToken, folderName);
    if (!folderId) {
        throw new Error(`Folder "${folderName}" not found`);
    }
    return getEmailsFromFolder(accessToken, folderId);
}


export async function getMessageById(accessToken: string, messageId: string) {
    const res = await fetch(`https://graph.microsoft.com/v1.0/me/messages/${encodeURIComponent(messageId)}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) {
        console.error("Failed to fetch message:", await res.text());
        return null;
    }

    const data = await res.json();
    return data;
}
