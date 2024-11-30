import { uiText, discordEmojis, sleep } from "#helpers";
import { menus } from "#menus";
import { DiscordBotToken, ProgramMenuProps } from "#types";
import log from "consola";
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
        log.error(`An error occurred while fetching ${token.name}'s emojis`);
        await sleep(1000);
        menus.discord.emojis.main(props, token);
        return null;
    }

    const amount = result.data.length;
    if (!amount){
        log.fail("No emojis to list");
        await sleep(1000);
        menus.discord.emojis.main(props, token);
        return null;
    }

    return result.data;
}