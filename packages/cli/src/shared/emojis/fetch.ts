import { CLI } from "#cli";
import { uiMessage, discordEmojis, sleep, log } from "#helpers";
import { menus } from "#menus";
import { DiscordBotToken } from "#types";
import ora from "ora";

interface FetchDiscordEmojisProps {
    cli: CLI,
    token: DiscordBotToken;
    notCheckAmount?: boolean;
}

export async function fetchDiscordEmojis({ cli, token, notCheckAmount=false }: FetchDiscordEmojisProps){
    const loading = ora({
        text: uiMessage({
            "en-US": "Fetching emojis",
            "pt-BR": "Buscando emojis"
        }),
    }).start();

    const result = await discordEmojis.get(token);
    loading.stop();

    if (!result.success){
        log.error(uiMessage({
            "en-US": `An error occurred while fetching ${token.name}'s emojis`,
            "pt-BR": `Ocorreu um erro ao buscar os emojis de ${token.name}`,
        }));
        await sleep(1000);
        menus.discord.emojis.main(cli, token);
        return null;
    }

    if (!notCheckAmount && !result.data.length){
        log.fail(uiMessage({
            "en-US": "No emojis to list",
            "pt-BR": "Nenhum emoji para listar",
        }));
        await sleep(1000);
        menus.discord.emojis.main(cli, token);
        return null;
    }

    return result.data;
}