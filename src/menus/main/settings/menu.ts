import { colors, commonTexts, divider, uiText } from "#helpers";
import { menus } from "#menus";
import { ProgramMenuProps } from "#types";
import { select } from "@inquirer/prompts";
import ck from "chalk";

export async function settingsMenu(props: ProgramMenuProps){
    const menu = await select({
        message: uiText(props.lang, {
            "pt-BR": "❑ Configurações",
            "en-US": "❑ Settings",
        }, ck.reset.cyan.underline),
        choices: [
            { 
                name: uiText(props.lang, {
                    "pt-BR": "🗝️  Gerenciar tokens de discord",
                    "en-US": "🗝️  Manage discord tokens",
                }, ck.green),
                value: "discord/bot/tokens" 
            },
            { 
                name: uiText(props.lang, {
                    "pt-BR": "🌐 Idioma",
                    "en-US": "🌐 Language",
                }, ck.hex(colors.azoxo)),
                value: "lang" 
            },
            { 
                name: commonTexts(props.lang).back,
                value: "back" 
            },
        ]
    });
    divider();
    
    switch(menu){
        case "discord/bot/tokens":{

            return;
        }
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