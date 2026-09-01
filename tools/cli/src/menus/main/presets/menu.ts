import { commonTexts, divider, uiMessage } from "#helpers";
import { menus } from "#menus";
import { ck } from "#utils/ck.js";
import { select } from "@inquirer/prompts";
import { withDefaults } from "../../../helpers/prompts.js";

export async function presetsMenu(){
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
            await menus.presets.scripts.main();
            return;
        }
        case "tokens":{
            await menus.presets.tokens.main();
            return;
        }
        case "back":{
            await menus.main();
            return;
        }
    }
}