import { menus } from "#menus";
import { program, ScriptPreset } from "#program";
import { prompts } from "#shared/prompts.js";
import { ck } from "#utils/ck.js";
import { log } from "#utils/log.js";
import { rm } from "node:fs/promises";
import path from "node:path";
import { formatPresets } from "./actions/format.js";
import { noSelect } from "./actions/noselect.js";

export async function presetsScriptsDeleteMenu(presets: ScriptPreset[]) {
    const selected = await prompts.checkbox({
        message: "Select the presets you want to delete",
        choices: formatPresets(presets, true),
        // instructions: instructions.checkbox, TODO
        required: false,
    });
    console.log();


    if (selected.length < 1){
        await noSelect();
        return;
    }

    await Promise.all(selected.map(id => 
        rm(path.join(program.config.dirname(), "presets/scripts", id), {
            force: true, recursive: true,
        })
    ));

    program.config.set("presets.scripts", 
        presets.filter(t => !selected.includes(t.id))
    );

    log.success(ck.green("Selected presets removed successfully!"));
    console.log();
    await menus.presets.scripts.main();
}