import { copy, withDefaults } from "#helpers";
import { menus } from "#menus";
import { program, ScriptPreset } from "#program";
import { search } from "@inquirer/prompts";
import { rm } from "node:fs/promises";
import path from "node:path";
import { formatPresets } from "./actions/format.js";
import { modifyScriptPresetMenu } from "./actions/modify.js";

export async function presetsScriptsEditMenu(presets: ScriptPreset[]) {
    const selected = await search(withDefaults({
        message: "Select the presets you want to edit",
        async source(term) {
            if (!term) return formatPresets(presets);

            return formatPresets(presets.filter(preset => {
                const name = preset.name.toLowerCase();
                return name.startsWith(term.toLowerCase()) ||
                    name.includes(term.toLowerCase());
            }));
        },
    }));
    console.log();

    if (selected === "back"){
        menus.presets.scripts.main();
        return;
    }

    const index = presets.findIndex(preset => preset.id === selected);
    const original = presets[index];
    if (!original) {
        await menus.presets.scripts.edit(presets);
        return;
    }
    const preset = { ...original };

    const status = await modifyScriptPresetMenu(preset, true);

    if (status === "cancel") {
        await menus.presets.scripts.edit(presets);
        return;
    }

    const removed = original.files.filter(file =>
        preset.files.some(f => f.path === file.path)
    );

    const presetPath = path.join(
        program.config.dirname(), 
        "presets/scripts", 
        preset.id
    );

    await Promise.all(removed.map(file =>
        rm(path.join(presetPath, file.path), { force: true })
            .catch(() => null)
    ));

    await Promise.all(preset.files.map(
        ({ path: filepath, dist = filepath }) =>
            copy(path.join(process.cwd(), filepath), path.join(presetPath, dist))
                .catch(() => null)
    ));

    presets[index] = preset;
    program.config.set("presets.scripts", presets);

    await menus.presets.scripts.main();
}