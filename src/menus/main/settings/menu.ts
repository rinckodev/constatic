import { colors, commonTexts, divider, uiMessage } from "#helpers";
import { menus } from "#menus";
import { select } from "@inquirer/prompts";
import ck from "chalk";
import type { CLI } from "#cli";

export async function settingsMenu(cli: CLI){
    const menu = await select({
        message: uiMessage({
            "pt-BR": "❑ Configurações",
            "en-US": "❑ Settings",
        }, ck.reset.cyan.underline),
        choices: [
            { 
                name: uiMessage({
                    "pt-BR": "🌐 Idioma",
                    "en-US": "🌐 Language",
                }, ck.hex(colors.azoxo)),
                value: "lang" 
            },
            { 
                name: commonTexts.back,
                value: "back" 
            },
        ]
    });
    divider();
    
    switch(menu){
        case "lang":{
            menus.settings.lang(cli);
            return;
        }
        case "back":{
            menus.main(cli);
            return;
        }
    }
}