import { uiText, discordEmojis, sleep, log } from "#helpers";
import { menus } from "#menus";
import { DiscordBotToken, ProgramMenuProps } from "#types";
import ora from "ora";

interface FetchDiscordEmojisProps {
    props: ProgramMenuProps,
    token: DiscordBotToken;
    notCheckAmount?: boolean;
}

export async function fetchDiscordEmojis({ props, token, notCheckAmount=false }: FetchDiscordEmojisProps){
    const loading = ora({
        text: uiText(props.lang, {
            "en-US": "Fetching emojis",
            "pt-BR": "Buscando emojis"
        }),
    }).start();

    const result = await discordEmojis.get(token);
    loading.stop();

    if (!result.success){
        log.error(uiText(props.lang, {
            "en-US": `An error occurred while fetching ${token.name}'s emojis`,
            "pt-BR": `Ocorreu um erro ao buscar os emojis de ${token.name}`,
        }));
        await sleep(1000);
        menus.discord.emojis.main(props, token);
        return null;
    }

    if (!notCheckAmount && !result.data.length){
        log.fail(uiText(props.lang, {
            "en-US": "No emojis to list",
            "pt-BR": "Nenhum emoji para listar",
        }));
        await sleep(1000);
        menus.discord.emojis.main(props, token);
        return null;
    }

    return result.data;
}