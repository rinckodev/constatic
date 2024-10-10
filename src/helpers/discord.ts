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
    const response = await fetch("https://discord.com/api/v10/applications/@me", {
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
        success: true,
        id: data["id"],
        name: data["name"],
        invite: url.toString()
    }
}