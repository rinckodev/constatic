import { cliTheme, commonTexts, divider, log, sleep, uiText } from "#helpers";
import { menus } from "#menus";
import { fetchDiscordTokenData } from "#shared/tokens.js";
import { ProgramMenuProps } from "#types";
import { select } from "@inquirer/prompts";
import ck from "chalk";

export async function selectDiscordBot(props: ProgramMenuProps){
    const tokens = props.conf.get("discord.bot.tokens", []);

    const choices = tokens.map((token, index) => ({
        name: `${ck.green("●")} ${ck.blue(token.name)}`,
        value: index,
    }));

    choices.unshift({
        name: uiText(props.lang, {
            "en-US": "✦ New temporary application",
            "pt-BR": "✦ Nova aplicação temporária",
        }, ck.green),
        value: -2,
    })

    choices.push({ name: commonTexts(props.lang).back, value: -1 });

    const index = await select({
        message: uiText(props.lang, {
            "en-US": "Select an application",
            "pt-BR": "Selecione uma aplicação",
        }),
        theme: cliTheme,
        choices
    });
    divider();

    if (index === -1){
        menus.main(props)
        return;
    }
    if (index === -2){
        const token = await menus.settings.tokens.prompts.token(props.lang);

        const result = await fetchDiscordTokenData(token, props.lang);
        divider();
        if (!result.success){
            log.error(result.error);
            await sleep(500);
            selectDiscordBot(props);
            return;
        }
        menus.discord.emojis.main(props, result.data);
        return;
    }
    menus.discord.emojis.main(props, tokens[index]);
}