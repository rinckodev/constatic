import { commonTexts, divider, uiMessage } from "#helpers";
import { menus } from "#menus";
import { select } from "@inquirer/prompts";
import ck from "chalk";
import { withDefaults } from "../../../helpers/prompts.js";
import { CLI } from "#cli";

export async function presetsMenu(cli: CLI){
    const menu = await select(withDefaults({
        message: uiMessage({
            "pt-BR": "❑ Predefinições",
            "en-US": "❑ Presets",
        }, ck.reset.cyan.underline),
        choices: [
            { 
                name: uiMessage({
                    "pt-BR": "🗐 Scripts",
                    "en-US": "🗐 Scripts",
                }, ck.green),
                value: "scripts" 
            },
            { 
                name: uiMessage({
                    "pt-BR": "☵ Tokens",
                    "en-US": "☵ Tokens",
                }, ck.green),
                value: "tokens" 
            },
            { 
                name: commonTexts.back,
                value: "back" 
            },
        ]
    }));
    divider();
    
    switch(menu){
        case "scripts":{
            menus.presets.scripts.main(cli);
            return;
        }
        case "tokens":{
            menus.presets.tokens.main(cli);
            return;
        }
        case "back":{
            menus.main(cli);
            return;
        }
    }
}