import { PackageJson } from "pkg-types";

export interface ScriptPresetFile {
    path: string;
    dist?: string;
}

export interface ScriptPreset {
    id: string;
    type: "default"
    name: string;
    files: ScriptPresetFile[];
    packageJson?: Pick<PackageJson, "dependencies" | "devDependencies">,
}