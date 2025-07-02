import type { DiscordBotToken, FetchResult } from "#types";
import { getDiscordBotInfo, uiMessage } from "#helpers";
import ck from "chalk";
import ora from "ora";

type FetchDiscordTokenDataReturn = Promise<FetchResult<DiscordBotToken>>;

export async function fetchDiscordTokenData(token: string): FetchDiscordTokenDataReturn {
    const fetching = ora();
    fetching.start(uiMessage({
        "en-US": "🔍 Fetching token information...",
        "pt-BR": "🔍 Buscando informações do token...",
    }));

    const result = await getDiscordBotInfo(token);
    fetching.stop();

    const { success } = result;

    return success
        ? { success, data: { token, ...result.data } }
        : {
            success, error: uiMessage({
                "en-US": "The provided token is invalid",
                "pt-BR": "O token informado é inválido!",
            }, ck.red)
        }
}