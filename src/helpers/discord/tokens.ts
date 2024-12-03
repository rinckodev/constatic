import { FetchResult } from "#types";

const baseURL = "https://discord.com/api/v10";

type GetDiscordBotInfoResult = FetchResult<{
    invite: string;
    name: string;
    id: string;
}>;
export async function getDiscordBotInfo(token: string): Promise<GetDiscordBotInfoResult> {
    const response = await fetch(`${baseURL}/applications/@me`, {
        headers: { Authorization: `Bot ${token}` }
    });
    
    if (response.status !== 200){
        return {
            success: false,
            error: "The provided token is invalid"
        }
    }
    const data = await response.json();
    
    const url = new URL("https://discord.com/oauth2/authorize?scope=bot+applications.commands");
    url.searchParams.set("client_id", data["id"]);
    url.searchParams.set("permissions", "8");
    
    return {
        success: true,
        data: {
            id: data["id"],
            name: data["name"],
            invite: url.toString()
        }
    }
}