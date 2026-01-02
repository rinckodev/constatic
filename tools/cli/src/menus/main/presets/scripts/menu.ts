import { commonTexts, divider, uiMessage } from "#helpers";
import { menus } from "#menus";
import { select } from "@inquirer/prompts";
import ck from "chalk";
import { withDefaults } from "../../../../helpers/prompts.js";
import { CLI } from "#cli";

export async function scriptPresetsMenu(cli: CLI){
    const presets = cli.config.get("presets.scripts", []);

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
            menus.presets.scripts.new(cli);
            return;
        }
        case "apply":{
            menus.presets.scripts.apply(cli, presets);
            return;
        }
        case "list":{
            menus.presets.scripts.list(cli, presets);
            return;
        }
        case "edit":{
            menus.presets.scripts.edit(cli, presets);
            return;
        }
        case "delete":{
            menus.presets.scripts.delete(cli, presets);
            return;
        }
        case "back":{
            menus.presets.main(cli);
            return;
        }
    }

}