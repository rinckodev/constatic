import { copy, divider, log, sleep, uiMessage } from "#helpers";
import { menus } from "#menus";
import { withDefaults } from "../../../../helpers/prompts.js";
import { ScriptPreset } from "#types";
import { input } from "@inquirer/prompts";

import ck from "chalk";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { modifyScriptPresetMenu } from "./actions/modify.js";
import { CLI } from "#cli";

export async function presetsScriptsNewMenu(cli: CLI) {
    const presets = cli.config.get("presets.scripts", []);
    const preset: ScriptPreset = {
        name: "", type: "default",
        id: new Date().getTime().toString(),
        files: []
    };

    const status = await modifyScriptPresetMenu(cli, preset);

    if (status === "cancel") {
        menus.presets.scripts.main(cli);
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
        cli.config.dirname, 
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
    cli.config.set("presets.scripts", presets);

    log.success(uiMessage({
        "en-US": "Preset created successfully!",
        "pt-BR": "Predefinição criada com sucesso!",
    }, ck.green));

    await sleep(400);
    menus.presets.scripts.main(cli);
}