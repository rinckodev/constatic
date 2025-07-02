import type { DiscordBotToken, FetchResult } from "#types";
import { uiMessage } from "#helpers";
import { withDefaults } from "#prompts";
import { fetchDiscordTokenData } from "#shared/tokens.js";
import { password } from "@inquirer/prompts";
import ck from "chalk";

type PromptTokenResult = FetchResult<DiscordBotToken>;

export async function promptToken(tokens: DiscordBotToken[]): Promise<PromptTokenResult> {
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
        return {
            success: false,
            error: uiMessage({
                "en-US": `This token is already saved! ${name}`,
                "pt-BR": `Este token já está salvo! ${name}`,
            }, ck.red)
        }
    }

    return await fetchDiscordTokenData(token);

}