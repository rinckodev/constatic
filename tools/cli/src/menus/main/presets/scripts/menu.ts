import { commonTexts, divider, uiMessage } from "#helpers";
import { menus } from "#menus";
import { program } from "#program";
import { ck } from "#utils/ck.js";
import { select } from "@inquirer/prompts";
import { withDefaults } from "../../../../helpers/prompts.js";

export async function scriptPresetsMenu(){
    const presets = program.config.get("presets.scripts", []);

    const disabled = presets.length ? false : " ";

    const action = await select(withDefaults({
        message: uiMessage({
            "pt-BR": "❑ Gerenciar predefinições de scripts",
            "en-US": "❑ Manage script presets",
        }, ck.reset.cyan.underline),
        choices: [
            { 
                name: uiMessage({
                    "en-US": "✦ New preset",
                    "pt-BR": "✦ Nova predefinição",
                }, ck.green),
                value: "new" 
            },
            { 
                name: uiMessage({
                    "en-US": "↯ Apply preset",
                    "pt-BR": "↯ Aplicar predefinição",
                }, ck.magenta),
                value: "apply", 
                disabled 
            },
            { 
                name: uiMessage({
                    "en-US": "☰ Lists preset",
                    "pt-BR": "☰ Listar predefinição",
                }, ck.blue),
                value: "list",
                disabled 
            },
            { 
                name: uiMessage({
                    "en-US": "✎ Edit preset",
                    "pt-BR": "✎ Editar predefinição",
                }, ck.yellow),
                value: "edit" ,
                disabled
            },
            { 
                name: uiMessage({
                    "en-US": "✗ Delete preset",
                    "pt-BR": "✗ Excluir predefinição",
                }, ck.red),
                value: "delete",
                disabled 
            },
            {
                name: commonTexts.back,
                value: "back" 
            },
        ]
    }));
    divider();

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