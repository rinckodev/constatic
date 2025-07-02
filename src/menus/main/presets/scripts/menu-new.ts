import { divider, log, sleep, uiMessage } from "#helpers";
import { menus } from "#menus";
import { withDefaults } from "#prompts";
import { ProgramMenuProps, ScriptPreset } from "#types";
import { input } from "@inquirer/prompts";

import ck from "chalk";
import { copy } from "fs-extra";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { modifyScriptPresetMenu } from "./actions/modify.js";

export async function presetsScriptsNewMenu(props: ProgramMenuProps) {
    const presets = props.conf.get("presets.scripts", []);
    const preset: ScriptPreset = {
        name: "", type: "default",
        id: new Date().getTime().toString(),
        files: []
    };

    const status = await modifyScriptPresetMenu(props, preset);

    if (status === "cancel") {
        menus.presets.scripts.main(props);
        return;
    }

    preset.name = await input(withDefaults({
        message: uiMessage({
            "en-US": "Preset name:",
            "pt-BR": "Nome da predefinição:",
        })
    }));
    divider();
    
    const presetpath = path.join(props.configdir, "presets/scripts", preset.id);
    await mkdir(presetpath, { recursive: true });

    await Promise.all(preset.files.map(
        ({ path: filepath, dist=filepath }) => 
            copy(path.join(props.cwd, filepath), path.join(presetpath!, dist))
        .catch(() => null)
    ));
    
    presets.push(preset);
    props.conf.set("presets.scripts", presets);

    log.success(uiMessage({
        "en-US": "Preset created successfully!",
        "pt-BR": "Predefinição criada com sucesso!",
    }, ck.green));

    await sleep(400);
    menus.presets.scripts.main(props);
}