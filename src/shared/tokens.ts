import { getDiscordBotInfo, uiMessage } from "#helpers";
import { Result } from "#lib/result.js";
import ck from "chalk";
import ora from "ora";

export async function fetchDiscordTokenData(token: string) {
    const fetching = ora();
    fetching.start(uiMessage({
        "en-US": "🔍 Fetching token information...",
        "pt-BR": "🔍 Buscando informações do token...",
    }));
    const r = await getDiscordBotInfo(token);
    fetching.stop();

    return r.success
        ? Result.ok({ token, ...r.data })
        : Result.fail(uiMessage({
            "en-US": "The provided token is invalid",
            "pt-BR": "O token informado é inválido!",
        }, ck.red));
}