import { uiText, discordEmojis, sleep, log } from "#helpers";
import { menus } from "#menus";
import { DiscordBotToken, ProgramMenuProps } from "#types";
import ora from "ora";

export async function fetchDiscordEmojis(props: ProgramMenuProps, token: DiscordBotToken){
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

    const amount = result.data.length;
    if (!amount){
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