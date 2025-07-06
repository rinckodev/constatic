import type { ProgramMenuProps, ScriptPreset } from "#types";
import merge from "lodash.merge";
import { PackageJson } from "pkg-types";
import path from "node:path";
import { copy } from "#helpers";

interface ApplyScriptPresetsProps extends Pick<ProgramMenuProps, "cwd" | "configdir"> {
    presets: ScriptPreset[];
    packageJson?: PackageJson | null;
}
export async function applyScriptPresets(props: ApplyScriptPresetsProps) {
    const { configdir, cwd, packageJson, presets } = props;
    const promises: Promise<void>[] = [];
    for (const script of presets) {
        if (packageJson && script.packageJson) {
            merge(packageJson, script.packageJson);
        }
        promises.push(...script.files.map(file => copy(
            path.join(configdir, "presets/scripts", script.id, file.path),
            path.join(cwd, file.dist ?? file.path),
        )))
    }
    await Promise.all(promises).catch(() => null);
}