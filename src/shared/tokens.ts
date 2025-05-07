import { getDiscordBotInfo, uiText } from "#helpers";
import { DiscordBotToken, FetchResult, Language } from "#types";
import ck from "chalk";
import ora from "ora";

type FetchDiscordTokenDataReturn = Promise<FetchResult<DiscordBotToken>>;

export async function fetchDiscordTokenData(token: string, lang: Language): FetchDiscordTokenDataReturn {
    const fetching = ora();
    fetching.start(uiText(lang, {
        "en-US": "🔍 Fetching token information...",
        "pt-BR": "🔍 Buscando informações do token...",
    }));

    const result = await getDiscordBotInfo(token);
    fetching.stop();

    const { success } = result;

    return success
        ? { success, data: { token, ...result.data } }
        : {
            success, error: uiText(lang, {
                "en-US": "The provided token is invalid",
                "pt-BR": "O token informado é inválido!",
            }, ck.red)
        }
}