import { program } from "#program";
import { Result, ResultType } from "#utils/result.js";
import { stat } from "node:fs/promises";
import { KeyValueFile } from "../lib/kvf.js";
import { DISCORD_API_URL } from "./constants.js";

export interface DiscordBotToken {
    id: string;
    name: string;
    token: string;
}

export async function fetchToken(token: string): Promise<ResultType<DiscordBotToken>> {
    const response = await fetch(`${DISCORD_API_URL}/applications/@me`, {
        headers: { Authorization: `Bot ${token}` }
    });
    if (!response.ok) return Result.fail(
        `[${response.statusText}] The provided token is invalid`
    );
    const data = await response.json() as DiscordBotToken;

    return Result.ok({
        id: data.id,
        name: data.name,
        token
    });
}

export async function resolveToken(tokenLike: string) {
    const tokens = program.config.get("discord.bot.tokens", []);
    
    const savedToken = tokens.find(t => 
        t.name.toLowerCase() === tokenLike.toLowerCase()
    );
    if (savedToken) return Result.ok(savedToken);
    
    const result = await fetchToken(tokenLike);
    if (result.success) return result;
    const error = "Invalid token provided";

    const fileExists = await stat(tokenLike)
        .then(s => s.isFile())
        .catch(() => false);
        
    const env = new KeyValueFile(tokenLike);

    return env.read()
        .then(() => {
            if (!("BOT_TOKEN" in env.record && !!env.record.BOT_TOKEN)){
                return Result.fail(
                    fileExists 
                        ? "No token identified in the env file."
                        : error
                );
            }
            return fetchToken(env.record.BOT_TOKEN);
        })
        .catch(() => Result.fail(error));
}