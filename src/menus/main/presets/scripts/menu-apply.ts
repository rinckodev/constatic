import { divider, instructions, json, log, sleep, uiMessage } from "#helpers";
import { menus } from "#menus";
import { checkbox } from "@inquirer/prompts";
import { ScriptPreset } from "#types";
import ck from "chalk";
import { withDefaults } from "../../../../helpers/prompts.js";
import path from "node:path";
import { formatPresets } from "./actions/format.js";
import { PackageJson } from "pkg-types";
import { applyScriptPresets } from "#shared/presets/scripts/apply.js";
import { noSelect } from "./actions/noselect.js";
import { packageJsonHasDeps } from "#shared/presets/scripts/deps.js";
import { CLI } from "#cli";

export async function presetsScriptsApplyMenu(cli: CLI, presets: ScriptPreset[]) {
    const selected = await checkbox(withDefaults({
        message: uiMessage({
            "en-US": "Select the presets you want to apply",
            "pt-BR": "Selecione as predefinições que deseja aplicar",
        }),
        instructions: instructions.checkbox,
        choices: formatPresets(presets, true),
        required: false,
    }));
    divider();

    if (selected.length < 1) {
        await noSelect(cli);
        return;
    }

    const selectedPresets = presets.filter(
        preset => selected.includes(preset.id)
    );

    const pkgJsonPath = path.join(process.cwd(), "package.json");

    const pkg = await json
        .read<PackageJson>(pkgJsonPath)
        .catch(() => null);

    const hasDeps = selectedPresets.some(
        preset => packageJsonHasDeps(preset.packageJson??{})
    );

    if (!pkg && hasDeps) {
        const ref = ck.underline("package.json");
        log.warn(uiMessage({
            "en-US": [
                `The file ${ref} was not found in the root or is incorrect!`,
                "The preset dependencies cannot be applied."
            ].join("\n"),
            "pt-BR": [
                `O arquivo ${ref} não foi encontrado na raiz ou está incorreto!`,
                "As dependências das predefinições não podem ser aplicadas."
            ].join("\n"),
        }, ck.yellow));
        divider();
    }

    await applyScriptPresets(cli, {
        dist: process.cwd(),
        pkg, presets: selectedPresets,
    });

    if (pkg) {
        await json.write(pkgJsonPath, pkg);
    }

    log.success(uiMessage({
        "en-US": "Selected presets applied successfully!",
        "pt-BR": "Predefinições selecionadas aplicadas com sucesso!",
    }, ck.green));
    divider();

    await sleep(400);
    menus.presets.scripts.main(cli);
}