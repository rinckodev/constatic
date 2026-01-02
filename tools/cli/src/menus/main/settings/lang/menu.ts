import type { CLI } from "#cli";
import { cliLang, commonTexts, divider, uiMessage } from "#helpers";
import { menus } from "#menus";
import { withDefaults } from "../../../../helpers/prompts.js";
import { Language } from "#types";
import { select } from "@inquirer/prompts";
import ck from "chalk";

export async function settingsLangMenu(cli: CLI){
    const arg = await select(withDefaults({
        message: uiMessage({
            "en-US": "Change CLI language",
            "pt-BR": "Alterar idioma da CLI",
        }),
        choices: [
            {
                name: "💚 " + uiMessage({
                    "en-US": `${ck.green(`Port${ck.yellow("uguese")}`)} ${ck.dim("(BR)")}`,
                    "pt-BR": `${ck.green(`Port${ck.yellow("uguês")}`)} ${ck.dim("(BR)")}`,
                }),
                value: "pt-BR" 
            },
            { 
                name: "🦅 " + uiMessage({
                    "en-US": `${ck.blue(`Eng${ck.red("lish")}`)} ${ck.dim("(US)")}`,
                    "pt-BR": `${ck.blue(`Ing${ck.red("lês")}`)} ${ck.dim("(US)")}`,
                }),
                value: "en-US"
            },
            { 
                name: commonTexts.back,
                value: "back" 
            },
        ]
    }));
    divider();

    if (arg === "back"){
        menus.settings.main(cli);
        return;
    }

    cliLang.set(arg as Language);
    cli.config.set("lang", arg);
    menus.settings.lang(cli);
}