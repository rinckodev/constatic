import type { APIEmoji, DiscordBotToken, FetchResult } from "#types";

const baseURL = "https://discord.com/api/v10";

type GetDiscordEmojisResult = FetchResult<APIEmoji[]>;

async function getDiscordEmojis(token: DiscordBotToken): Promise<GetDiscordEmojisResult> {
    const response = await fetch(`${baseURL}/applications/${token.id}/emojis`, {
        headers: { Authorization: `Bot ${token.token}` }
    });

    if (response.status !== 200) {
        return {
            success: false,
            error: "The provided token is invalid"
        }
    }
    const data = await response.json();

    return {
        success: true,
        data: data.items as APIEmoji[]
    }
}


type CreateDiscordEmojiResult = FetchResult<APIEmoji, { exists?: boolean }>;

interface CreateDiscordEmojiProps {
    name: string, image: string;
}
async function createDiscordEmoji(token: DiscordBotToken, props: CreateDiscordEmojiProps): Promise<CreateDiscordEmojiResult> {
    const response = await fetch(`${baseURL}/applications/${token.id}/emojis`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bot ${token.token}`
        },
        body: JSON.stringify(props)
    });
    const data = await response.json();
    if (response.status === 400 && data.code && data.code === 50035) {
        return { success: false, error: data.code, exists: true }
    }
    if (!response.ok) {
        return {
            success: false,
            error: data.message ?? response.statusText,
        }
    }

    return {
        success: true,
        data: data as APIEmoji
    }
}

type DeleteDiscordEmojiResult = FetchResult<undefined>;

interface CreateDiscordEmojiProps {
    name: string, image: string;
}
async function deleteDiscordEmoji(token: DiscordBotToken, id: string): Promise<DeleteDiscordEmojiResult> {
    const response = await fetch(`${baseURL}/applications/${token.id}/emojis/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bot ${token.token}`
        }
    });

    if (response.status !== 204) {
        return {
            success: false,
            error: response.statusText,
        }
    }
    
    return {
        success: true,
        data: undefined,
    }
}

function formatEmojiName(name: string){
    return name
    .trim()
    .replaceAll(" ", "_")
    .replaceAll("-", "_")
    .split("_")
    .filter(w => w.length)
    .join("_")
    .toLowerCase()
}

export const discordEmojis = {
    get: getDiscordEmojis,
    create: createDiscordEmoji,
    delete: deleteDiscordEmoji,
    formatName: formatEmojiName
}