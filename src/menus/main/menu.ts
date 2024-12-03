import { ProgramMenuProps } from "#types";
import { select } from "@inquirer/prompts";
import { cliTheme, divider, uiText } from "#helpers";
import ck from "chalk";
import { menus } from "#menus";

"◆ ◇ ◈"

export async function mainMenu(props: ProgramMenuProps){
    const menu = await select({
        message: uiText(props.lang, {
            "pt-BR": "❑ Menu principal",
            "en-US": "❑ Main menu",
        }, ck.reset.cyan.underline),
        theme: cliTheme,
        choices: [
            { 
                name: uiText(props.lang, {
                    "en-US": "◈ Init discord bot project",
                    "pt-BR": "◈ Iniciar projeto de bot de discord",
                }, ck.green),
                value: "discord/bot" 
            },
            { 
                name: uiText(props.lang, {
                    "en-US": "◈ Manage discord emojis",
                    "pt-BR": "◈ Gerenciar emojis do discord",
                }, ck.green),
                value: "discord/emojis" 
            },
            { 
                name: uiText(props.lang, {
                    "en-US": "☰ Settings",
                    "pt-BR": "☰ Configurações",
                }, ck.blue),
                value: "settings" 
            },
            {
                name: uiText(props.lang, {
                    "pt-BR": "✕ Sair",
                    "en-US": "✕ Quit"
                }, ck.red),
                value: "quit" 
            },
        ]
    });
    divider();
    
    switch(menu){
        case "discord/bot":{
            menus.discord.bot(props);
            return;
        }
        case "discord/emojis":{
            menus.discord.emojis.main(props);
            return;
        }
        case "settings":{
            menus.settings.main(props);
            return;
        }
        case "discord/emojis/manage":{

            return;
        }
    }
}