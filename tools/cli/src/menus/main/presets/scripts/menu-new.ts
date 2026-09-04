import { copy, withDefaults } from "#helpers";
import { menus } from "#menus";
import { input } from "@inquirer/prompts";

import { program, ScriptPreset } from "#program";
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
        message: "Preset name:",
        required: true,
    }));
    console.log();
    
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

    log.success(ck.green("Preset created successfully!"));

    await menus.presets.scripts.main();
}