import type { ScriptPreset } from "#types";
import merge from "lodash.merge";
import { PackageJson } from "pkg-types";
import path from "node:path";
import { copy } from "#helpers";
import { CLI } from "#cli";

interface ApplyScriptPresetsProps {
    presets: ScriptPreset[];
    dist: string;
    pkg?: PackageJson | null;
}
export async function applyScriptPresets(cli: CLI, props: ApplyScriptPresetsProps) {
    const { dist, presets, pkg } = props;
    const promises: Promise<void>[] = [];
    for (const script of presets) {
        if (pkg && script.packageJson) {
            merge(pkg, script.packageJson);
        }
        promises.push(...script.files.map(file => copy(
            path.join(cli.config.dirname, "presets/scripts", script.id, file.path),
            path.join(dist, file.dist ?? file.path),
        )))
    }
    await Promise.all(promises).catch(() => null);
}