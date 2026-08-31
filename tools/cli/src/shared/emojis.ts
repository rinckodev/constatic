import { Result } from "#lib/result.js";
import { DISCORD_API_URL } from "./constants.js";
import { DiscordBotToken } from "./token.js";

export interface APIEmoji {
    id: string;
    name: string;
    animated: boolean;
    user: {
        username: string;
        id: string;
    }
}

async function fetchEmojis(id: string, token: string) {
    const url = `${DISCORD_API_URL}/applications/${id}/emojis`;
    const response = await fetch(url, {
        headers: { Authorization: `Bot ${token}` }
    });

    if (!response.ok) return Result.fail(response.statusText);

    const data = await response.json() as { items: APIEmoji[] };

    return Result.ok(data.items);
}

export interface UploadEmojisData {
    name: string;
    base64: string;
}
async function uploadEmoji(
    token: DiscordBotToken, 
    data: UploadEmojisData
) {
    const url = `${DISCORD_API_URL}/applications/${token.id}/emojis`;
    const response = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bot ${token.token}` },
        body: JSON.stringify(data)
    });
    if (!response.ok){
        return Result.fail(response.statusText)
    }
    const responseData = await response.json() as APIEmoji;
    
    return Result.ok(responseData);
}
async function deleteEmoji(
    token: DiscordBotToken, 
    id: string
) {
    const url = `${DISCORD_API_URL}/applications/${token.id}/emojis/${id}`;
    const response = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bot ${token.token}` }
    });
    if (!response.ok){
        return Result.fail(response.statusText)
    }
    return Result.ok(true);
}

export default { 
    fetch: fetchEmojis, 
    upload: uploadEmoji, 
    delete: deleteEmoji 
};