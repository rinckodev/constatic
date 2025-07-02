import { colors, commonTexts, divider, uiMessage } from "#helpers";
import { menus } from "#menus";
import { select } from "@inquirer/prompts";
import { ProgramMenuProps } from "#types";
import ck from "chalk";

export async function settingsMenu(props: ProgramMenuProps){
    const menu = await select({
        message: uiMessage({
            "pt-BR": "❑ Configurações",
            "en-US": "❑ Settings",
        }, ck.reset.cyan.underline),
        choices: [
            // { 
            //     name: uiMessage({
            //         "pt-BR": "🗝️ Gerenciar tokens de discord",
            //         "en-US": "🗝️ Manage discord tokens",
            //     }, ck.green),
            //     value: "discord/bot/tokens" 
            // },
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
        // case "discord/bot/tokens":{
        //     menus.settings.tokens.main(props);
        //     return;
        // }
        case "lang":{
            menus.settings.lang(props);
            return;
        }
        case "back":{
            menus.main(props);
            return;
        }
    }
}