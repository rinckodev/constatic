import { discordApiURL } from "../constants/index.js";

interface SuccessResult {
    success: true;
    invite: string;
    name: string;
    id: string;
}
interface FailResult {
    success: false;
    message: string;
}
type Result = SuccessResult | FailResult;

export async function getDiscordBotInvite(token: string): Promise<Result> {
    const response = await fetch(`${discordApiURL}/applications/@me`, {
        headers: { Authorization: `Bot ${token}` }
    });
    
    if (response.status !== 200){
        return {
            success: false,
            message: "The provided token is invalid"
        }
    }
    const data = await response.json();
    
    const url = new URL("https://discord.com/oauth2/authorize?scope=bot+applications.commands");
    url.searchParams.set("client_id", data["id"]);
    url.searchParams.set("permissions", "8");
    
    return {
        id: data["id"],
        name: data["name"],
        success: true,
        invite: url.toString()
    }
}