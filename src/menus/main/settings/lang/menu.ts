import { cliTheme, commonTexts, divider, uiText } from "#helpers";
import { menus } from "#menus";
import { Language, ProgramMenuProps } from "#types";
import { select } from "@inquirer/prompts";
import ck from "chalk";

export async function settingsLangMenu(props: ProgramMenuProps){
    const arg = await select({
        message: uiText(props.lang, {
            "en-US": "Change CLI language",
            "pt-BR": "Alterar idioma da CLI",
        }),
        theme: cliTheme,
        choices: [
            {
                name: "💚 " + uiText(props.lang, {
                    "en-US": `${ck.green(`Port${ck.yellow("uguese")}`)} ${ck.dim("(BR)")}`,
                    "pt-BR": `${ck.green(`Port${ck.yellow("uguês")}`)} ${ck.dim("(BR)")}`,
                }),
                value: "pt-BR" 
            },
            { 
                name: "🦅 " + uiText(props.lang, {
                    "en-US": `${ck.blue(`Eng${ck.red("lish")}`)} ${ck.dim("(US)")}`,
                    "pt-BR": `${ck.blue(`Ing${ck.red("lês")}`)} ${ck.dim("(US)")}`,
                }),
                value: "en-US"
            },
            { 
                name: commonTexts(props.lang).back,
                value: "back" 
            },
        ]
    });
    divider();

    if (arg === "back"){
        menus.settings.main(props);
        return;
    }

    props.conf.set("lang", arg);
    props.lang = arg as Language;

    menus.settings.lang(props);
}