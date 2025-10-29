import { Result } from "#lib/result.js";
import type { APIEmoji, DiscordBotToken } from "#types";

const baseURL = "https://discord.com/api/v10";

async function getDiscordEmojis(token: DiscordBotToken){
    const response = await fetch(`${baseURL}/applications/${token.id}/emojis`, {
        headers: { Authorization: `Bot ${token.token}` }
    });

    if (response.status !== 200) {
        return Result.fail("The provided token is invalid");
    }
    const data = await response.json();

    return Result.ok(data.items as APIEmoji[]);
}

interface CreateDiscordEmojiProps {
    name: string, image: string;
}
async function createDiscordEmoji(token: DiscordBotToken, props: CreateDiscordEmojiProps){
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
        return Result.fail(data.code, 1);
    }
    if (!response.ok) {
        return Result.fail(data.message ?? response.statusText);
    }
    return Result.ok(data as APIEmoji);
}

interface CreateDiscordEmojiProps {
    name: string, image: string;
}
async function deleteDiscordEmoji(token: DiscordBotToken, id: string){
    const response = await fetch(`${baseURL}/applications/${token.id}/emojis/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bot ${token.token}`
        }
    });

    if (response.status !== 204) {
        return Result.fail(response.statusText);
    }
    
    return Result.ok(true);
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