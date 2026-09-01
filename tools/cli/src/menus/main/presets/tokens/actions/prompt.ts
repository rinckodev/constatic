import { uiMessage } from "#helpers";
import { fetchDiscordTokenData } from "#shared/tokens.js";
import type { DiscordBotToken } from "#types";
import { ck } from "#utils/ck.js";
import { Result } from "#utils/result.js";
import { password } from "@inquirer/prompts";
import { withDefaults } from "../../../../../helpers/prompts.js";

export async function promptToken(tokens: DiscordBotToken[]) {
    const token = await password(withDefaults({
        message: uiMessage({
            "en-US": "Insert your discord bot token",
            "pt-BR": "Insira seu token de bot de discord",
        }),
        validate(value) {
            const message = uiMessage({
                "en-US": "You need to provide the token for your bot application.",
                "pt-BR": "É necessário informar o token da sua aplicação de bot",
            });
            return !value ? message : true;
        },
    }));

    const existing = tokens.find(t => t.token === token)
    if (existing) {
        const name = `🤖 ${ck.yellow.underline(existing.name)}`;
        return Result.fail(uiMessage({
            "en-US": `This token is already saved! ${name}`,
            "pt-BR": `Este token já está salvo! ${name}`,
        }, ck.red));
    }
    return await fetchDiscordTokenData(token);

}