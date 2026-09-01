import { CLI } from "#cli";
import { byeMessage, divider, uiMessage } from "#helpers";
import { menus } from "#menus";
import { ck } from "#utils/ck.js";
import { select } from "@inquirer/prompts";
import { withDefaults } from "../../helpers/prompts.js";

export async function mainMenu(cli: CLI){
    const menu = await select(withDefaults({
        message: uiMessage({
            "pt-BR": "❑ Menu principal",
            "en-US": "❑ Main menu",
        }, ck.reset.cyan.underline),
        choices: [
            {
                name: uiMessage({
                    "en-US": "◈ Init discord bot project",
                    "pt-BR": "◈ Iniciar projeto de bot de discord",
                }, ck.green),
                value: "discord/bot" 
            },
            { 
                name: uiMessage({
                    "en-US": "◈ Manage discord emojis",
                    "pt-BR": "◈ Gerenciar emojis do discord",
                }, ck.green),
                value: "emojis" 
            },
            { 
                name: uiMessage({
                    "en-US": "◈ Manage presets",
                    "pt-BR": "◈ Gerenciar predefinições",
                }, ck.cyan),
                value: "presets" 
            },
            { 
                name: uiMessage({
                    "en-US": "☰ Settings",
                    "pt-BR": "☰ Configurações",
                }, ck.blue),
                value: "settings" 
            },
            {
                name: uiMessage({
                    "pt-BR": "✕ Sair",
                    "en-US": "✕ Quit"
                }, ck.red),
                value: "quit" 
            },
        ]
    }));
    divider();
    
    switch(menu){
        case "discord/bot":{
            menus.discord.bot(cli);
            return;
        }
        case "emojis":{
            menus.emojis.main();
            return;
        }
        case "settings":{
            menus.settings.main(cli);
            return;
        }
        case "presets":{
            menus.presets.main(cli);
            return;
        }
        case "quit":{
            console.log(byeMessage);
            divider();
            process.exitCode = 0;
        }
    }
}