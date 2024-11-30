import { uiText, sleep, commonTexts, divider } from "#helpers";
import { menus } from "#menus";
import { ProgramMenuProps } from "#types";
import { select } from "@inquirer/prompts";
import ck from "chalk";
import log from "consola";

export async function selectDiscordBot(props: ProgramMenuProps){
    const tokens = props.conf.get("discord.bot.tokens");
    if (!tokens.length){
        log.warn(uiText(props.lang, {
            "en-US": "You don't have any tokens saved yet! Go to the settings in the main menu.",
            "pt-BR": "Você não tem nenhum token salvo ainda! Acesse as configurações no menu principal",
        }));
        await sleep(1400);
        menus.main(props);
    }

    const choices = tokens.map((token, index) => ({
        name: ck.green(token.name),
        value: index,
    }));

    choices.push({ name: commonTexts(props.lang).back, value: -1 });

    const index = await select({
        message: uiText(props.lang, {
            "en-US": "Select an application",
            "pt-BR": "Selecione uma aplicação",
        }),
        choices
    });
    divider();

    if (index === -1){
        menus.main(props)
        return;
    }
    menus.discord.emojis.main(props, tokens[index]);
}