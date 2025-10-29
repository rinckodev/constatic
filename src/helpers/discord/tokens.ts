import { Result } from "#lib/result.js";

const baseURL = "https://discord.com/api/v10";

export async function getDiscordBotInfo(token: string) {
    const response = await fetch(`${baseURL}/applications/@me`, {
        headers: { Authorization: `Bot ${token}` }
    });

    if (response.status !== 200) {
        return Result.fail("The provided token is invalid");
    }
    const data = await response.json();

    const url = new URL("https://discord.com/oauth2/authorize?scope=bot+applications.commands");
    url.searchParams.set("client_id", data["id"]);
    url.searchParams.set("permissions", "8");

    return Result.ok({
        id: data["id"],
        name: data["name"],
        invite: url.toString()
    });
}