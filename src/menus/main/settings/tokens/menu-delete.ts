import { ProgramMenuProps } from "#types";
import { checkbox } from "@inquirer/prompts";
import { getDiscordTokens } from "./get.js";
import { cliTheme, commonTexts, divider, log, sleep, uiText } from "#helpers";
import { menus } from "#menus";
import ck from "chalk";

export async function settingsTokensDeleteMenu(props: ProgramMenuProps) {
    const tokens = await getDiscordTokens(props);
    if (!tokens) return;

    const choices = tokens.map(t => ({
        name: `🤖 ${ck.yellow.underline(t.name)}`, value: t.id
    }));

    const selected = await checkbox({
        message: [
            uiText(props.lang, {
                "en-US": "Select the tokens you want to delete",
                "pt-BR": "Selecione os tokens que deseja deletar",
            }),
            commonTexts(props.lang).instructions
        ].join("\n"),
        instructions: false,
        theme: {
            prefix: cliTheme.prefix,
            style: {
                renderSelectedChoices: () => "",
            }
        },
        choices,
        required: false,
    });
    divider();


    if (selected.length < 1){
        log.warn(uiText(props.lang, {
           "en-US": "No token selected, back to tokens menu",
           "pt-BR": "Nenhum token selecionado, voltando ao menu de tokens",
        }))
        divider();
        await sleep(500);
        menus.settings.tokens.main(props);
        return;
    }

    props.conf.set("discord.bot.tokens", 
        tokens.filter(t => !selected.includes(t.id))
    );

    log.success(uiText(props.lang, {
       "en-US": "Selected tokens removed successfully!",
       "pt-BR": "Tokens selecionados removidos com sucesso!",
    }, ck.green));
    divider();

    await sleep(500);
    menus.settings.tokens.main(props);
}