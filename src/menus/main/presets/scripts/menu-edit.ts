import { copy, divider, uiMessage } from "#helpers";
import { menus } from "#menus";
import { withDefaults } from "#prompts";
import { ProgramMenuProps, ScriptPreset } from "#types";
import { search } from "@inquirer/prompts";
import { rm } from "node:fs/promises";
import path from "node:path";
import { formatPresets } from "./actions/format.js";
import { modifyScriptPresetMenu } from "./actions/modify.js";

export async function presetsScriptsEditMenu(props: ProgramMenuProps, presets: ScriptPreset[]) {
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
        menus.presets.scripts.main(props);
        return;
    }

    const index = presets.findIndex(preset => preset.id === selected);
    const original = presets[index];
    if (!original) {
        menus.presets.scripts.edit(props, presets);
        return;
    }
    const preset = { ...original };

    const status = await modifyScriptPresetMenu(props, preset, true);

    if (status === "cancel") {
        menus.presets.scripts.edit(props, presets);
        return;
    }

    const removed = original.files.filter(file =>
        preset.files.some(f => f.path === file.path)
    );

    const presetPath = path.join(props.configdir, "presets/scripts", preset.id);

    await Promise.all(removed.map(file =>
        rm(path.join(presetPath, file.path), { force: true })
            .catch(() => null)
    ));

    await Promise.all(preset.files.map(
        ({ path: filepath, dist = filepath }) =>
            copy(path.join(props.cwd, filepath), path.join(presetPath, dist))
                .catch(() => null)
    ));

    presets[index] = preset;
    props.conf.set("presets.scripts", presets);

    menus.presets.scripts.main(props);
}