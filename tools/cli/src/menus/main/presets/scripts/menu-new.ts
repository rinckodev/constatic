import { copy, divider, uiMessage } from "#helpers";
import { menus } from "#menus";
import { ScriptPreset } from "#types";
import { input } from "@inquirer/prompts";
import { withDefaults } from "../../../../helpers/prompts.js";

import { program } from "#program";
import { ck } from "#utils/ck.js";
import { log } from "#utils/log.js";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { modifyScriptPresetMenu } from "./actions/modify.js";

export async function presetsScriptsNewMenu() {
    const presets = program.config.get("presets.scripts", []);
    const preset: ScriptPreset = {
        name: "", type: "default",
        id: new Date().getTime().toString(),
        files: []
    };

    const status = await modifyScriptPresetMenu(preset);

    if (status === "cancel") {
        menus.presets.scripts.main();
        return;
    }

    preset.name = await input(withDefaults({
        message: uiMessage({
            "en-US": "Preset name:",
            "pt-BR": "Nome da predefinição:",
        }),
        required: true,
    }));
    divider();
    
    const presetpath = path.join(
        program.config.dirname(), 
        "presets/scripts", 
        preset.id
    );
    await mkdir(presetpath, { recursive: true });

    await Promise.all(preset.files.map(
        ({ path: filepath, dist=filepath }) => 
            copy(path.join(process.cwd(), filepath), path.join(presetpath!, dist))
        .catch(() => null)
    ));
    
    presets.push(preset);
    program.config.set("presets.scripts", presets);

    log.success(uiMessage({
        "en-US": "Preset created successfully!",
        "pt-BR": "Predefinição criada com sucesso!",
    }, ck.green));

    await menus.presets.scripts.main();
}