import { FetchResult } from "#types";

type Result = FetchResult<{
    invite: string;
    name: string;
    id: string;
}>;

export async function getDiscordBotInvite(token: string): Promise<Result> {
    const response = await fetch("https://discord.com/api/v10/applications/@me", {
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