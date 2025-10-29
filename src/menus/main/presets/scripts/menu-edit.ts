import { copy, divider, uiMessage } from "#helpers";
import { menus } from "#menus";
import { withDefaults } from "../../../../helpers/prompts.js";
import { ScriptPreset } from "#types";
import { search } from "@inquirer/prompts";
import { rm } from "node:fs/promises";
import path from "node:path";
import { formatPresets } from "./actions/format.js";
import { modifyScriptPresetMenu } from "./actions/modify.js";
import { CLI } from "#cli";

export async function presetsScriptsEditMenu(cli: CLI, presets: ScriptPreset[]) {
    const selected = await search(withDefaults({
        message: uiMessage({
            "en-US": "Select the presets you want to edit",
            "pt-BR": "Selecione as predefinições que deseja editar",
        }),
        async source(term) {
            if (!term) return formatPresets(presets);

            return formatPresets(presets.filter(preset => {
                const name = preset.name.toLowerCase();
                return name.startsWith(term.toLowerCase()) ||
                    name.includes(term.toLowerCase());
            }));
        },
    }));
    divider();

    if (selected === "back"){
        menus.presets.scripts.main(cli);
        return;
    }

    const index = presets.findIndex(preset => preset.id === selected);
    const original = presets[index];
    if (!original) {
        menus.presets.scripts.edit(cli, presets);
        return;
    }
    const preset = { ...original };

    const status = await modifyScriptPresetMenu(cli, preset, true);

    if (status === "cancel") {
        menus.presets.scripts.edit(cli, presets);
        return;
    }

    const removed = original.files.filter(file =>
        preset.files.some(f => f.path === file.path)
    );

    const presetPath = path.join(
        cli.config.dirname, 
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
    cli.config.set("presets.scripts", presets);

    menus.presets.scripts.main(cli);
}