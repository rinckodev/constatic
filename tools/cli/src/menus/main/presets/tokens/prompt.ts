import { withDefaults } from "#helpers";
import { DiscordBotToken, fetchToken } from "#shared/token.js";
import { ck } from "#utils/ck.js";
import { Result } from "#utils/result.js";
import { password } from "@inquirer/prompts";

export async function promptToken(tokens: DiscordBotToken[]) {
    const token = await password(withDefaults({
        message: "Insert your discord bot token",
        validate(value) {
            const message = "You need to provide the token for your bot application.";
            return !value ? message : true;
        },
    }));

    const existing = tokens.find(t => t.token === token)
    if (existing) {
        const name = `🤖 ${ck.yellow.underline(existing.name)}`;
        return Result.fail(ck.red(`This token is already saved! ${name}`));
    }
    return fetchToken(token);

}