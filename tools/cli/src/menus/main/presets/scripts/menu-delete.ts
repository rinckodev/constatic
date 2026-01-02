import { divider, instructions, log, sleep, uiMessage } from "#helpers";
import { menus } from "#menus";
import { checkbox } from "@inquirer/prompts";
import { ScriptPreset } from "#types";
import ck from "chalk";
import { withDefaults } from "../../../../helpers/prompts.js";
import { rm } from "node:fs/promises";
import path from "node:path";
import { formatPresets } from "./actions/format.js";
import { noSelect } from "./actions/noselect.js";
import { CLI } from "#cli";

export async function presetsScriptsDeleteMenu(cli: CLI, presets: ScriptPreset[]) {
    const selected = await checkbox(withDefaults({
        message: uiMessage({
            "en-US": "Select the presets you want to delete",
            "pt-BR": "Selecione as predefinições que deseja deletar",
        }),
        choices: formatPresets(presets, true),
        instructions: instructions.checkbox,
        required: false,
    }));
    divider();


    if (selected.length < 1){
        await noSelect(cli);
        return;
    }

    await Promise.all(selected.map(id => 
        rm(path.join(cli.config.dirname, "presets/scripts", id), {
            force: true, recursive: true,
        })
    ));

    cli.config.set("presets.scripts", 
        presets.filter(t => !selected.includes(t.id))
    );


    log.success(uiMessage({
       "en-US": "Selected presets removed successfully!",
       "pt-BR": "Predefinições selecionados removidos com sucesso!",
    }, ck.green));
    divider();

    await sleep(500);
    menus.presets.scripts.main(cli);
}