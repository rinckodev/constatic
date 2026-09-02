import { commonTexts, withDefaults } from "#helpers";
import { menus } from "#menus";
import { program } from "#program";
import { ck } from "#utils/ck.js";
import { select } from "@inquirer/prompts";

export async function scriptPresetsMenu(){
    const presets = program.config.get("presets.scripts", []);

    const disabled = presets.length ? false : " ";

    const action = await select(withDefaults({
        message: ck.reset.cyan.underline("❑ Manage script presets"),
        choices: [
            { 
                name: ck.green("✦ New preset"),
                value: "new" 
            },
            { 
                name: ck.magenta("↯ Apply preset"),
                value: "apply", 
                disabled 
            },
            { 
                name: ck.blue("☰ Lists preset"),
                value: "list",
                disabled 
            },
            { 
                name: ck.yellow("✎ Edit preset"),
                value: "edit" ,
                disabled
            },
            { 
                name: ck.red("✗ Delete preset"),
                value: "delete",
                disabled 
            },
            {
                name: commonTexts.back,
                value: "back" 
            },
        ]
    }));
    console.log();

    switch(action){
        case "new":{
            await menus.presets.scripts.new();
            return;
        }
        case "apply":{
            await menus.presets.scripts.apply(presets);
            return;
        }
        case "list":{
            await menus.presets.scripts.list(presets);
            return;
        }
        case "edit":{
            await menus.presets.scripts.edit(presets);
            return;
        }
        case "delete":{
            await menus.presets.scripts.delete(presets);
            return;
        }
        case "back":{
            await menus.presets.main();
            return;
        }
    }

}