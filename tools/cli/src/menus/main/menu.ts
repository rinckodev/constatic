import { menus } from "#menus";
import { prompts } from "#shared/prompts.js";
import { quit } from "#utils/cancel.js";
import { ck } from "#utils/ck.js";

export async function mainMenu(){
    const menu = await prompts.select({
        message: ck.reset.cyan.underline("❑ Main menu"),
        choices: [
            {
                name: ck.green("◈ Init discord bot project"),
                value: "bot" 
            },
            { 
                name: ck.green("◈ Manage discord emojis"),
                value: "emojis" 
            },
            { 
                name: ck.cyan("◈ Manage presets"),
                value: "presets" 
            },
            {
                name: ck.red("✕ Quit"),
                value: "quit" 
            },
        ]
    });
    console.log();
    
    switch(menu){
        case "bot":{
            menus.discord.bot();
            return;
        }
        case "emojis":{
            menus.emojis.main();
            return;
        }
        case "presets":{
            menus.presets.main();
            return;
        }
        case "quit":{
            quit();
            return;
        }
    }
}