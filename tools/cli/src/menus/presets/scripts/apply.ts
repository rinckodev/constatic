import { json, sleep } from "#helpers";
import { menus } from "#menus";
import { ScriptPreset } from "#program";
import { applyScriptPresets } from "#shared/presets/scripts/apply.js";
import { packageJsonHasDeps } from "#shared/presets/scripts/deps.js";
import { prompts } from "#shared/prompts.js";
import { ck } from "#utils/ck.js";
import { log } from "#utils/log.js";
import path from "node:path";
import { PackageJson } from "pkg-types";
import { formatPresets } from "./actions/format.js";
import { noSelect } from "./actions/noselect.js";

export async function presetsScriptsApplyMenu(presets: ScriptPreset[]) {
    const selected = await prompts.multifilter({
        message: "Select the presets you want to apply",
        choices: formatPresets(presets, true),
        required: false,
        instructions: true,
    });

    console.log();

    if (selected.length < 1) {
        await noSelect();
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
        preset => packageJsonHasDeps(preset.packageJson ?? {})
    );

    if (!pkg && hasDeps) {
        const ref = ck.underline("package.json");
        log.warn(ck.yellow([
            `The file ${ref} was not found in the root or is incorrect!`,
            "The preset dependencies cannot be applied."
        ].join("\n")));
        console.log();
    }

    await applyScriptPresets({
        dist: process.cwd(),
        pkg, presets: selectedPresets,
    });

    if (pkg) {
        await json.write(pkgJsonPath, pkg);
    }

    log.success(ck.green("Selected presets applied successfully!"));
    console.log();

    await sleep(400);
    await menus.presets.scripts.main();
}