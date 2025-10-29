import type { PackageJson } from "pkg-types";
import type { EnvVarData } from "./env.js";

export interface BotPreset {
    name: string; 
    hint: string; 
    icon: string;
    packageJson: PackageJson;
    env?: EnvVarData[],
    disabled?: boolean;
    path: string;
}

export type BotDatabasePreset = BotPreset & {
    isORM?: boolean;
}

export type BotServerPreset = BotPreset;