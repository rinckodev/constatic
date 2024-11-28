import { APIEmoji, BotToken, FetchResult } from "#types";
import ck from "chalk";

const baseURL = "https://discord.com/api/v10";

type GetDiscordEmojisResult = FetchResult<APIEmoji[]>;

export async function getDiscordEmojis(token: BotToken): Promise<GetDiscordEmojisResult> {
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


type CreateDiscordEmojiResult = FetchResult<APIEmoji>;

interface CreateDiscordEmojiProps {
    name: string, image: string;
}
export async function createDiscordEmoji(token: BotToken, props: CreateDiscordEmojiProps): Promise<CreateDiscordEmojiResult> {
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
        return { success: false, error: `An emoji named ${ck.underline(props.name)} already exists for this application` }
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
export async function deleteDiscordEmoji(token: BotToken, id: string): Promise<DeleteDiscordEmojiResult> {
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