import type { ProgramMenuProps } from "#types";
import { commonTexts, divider, uiMessage } from "#helpers";
import { menus } from "#menus";
import { select } from "@inquirer/prompts";
import ck from "chalk";
import { withDefaults } from "#prompts";

export async function presetsMenu(props: ProgramMenuProps){
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
            menus.presets.scripts.main(props);
            return;
        }
        case "tokens":{
            menus.presets.tokens.main(props);
            return;
        }
        case "back":{
            menus.main(props);
            return;
        }
    }
}