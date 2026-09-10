import { commonTexts } from "#helpers";
import { menus } from "#menus";
import { prompts } from "#shared/prompts.js";
import { ck } from "#utils/ck.js";

export async function presetsMenu(){
    const menu = await prompts.select({
        message: ck.reset.cyan.underline("❑ Presets"),
        choices: [
            { 
                name: ck.green("🗐 Scripts"),
                value: "scripts" 
            },
            { 
                name: ck.green("☵ Tokens"),
                value: "tokens" 
            },
            { 
                name: commonTexts.back,
                value: "back" 
            },
        ]
    });
    console.log();
    
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