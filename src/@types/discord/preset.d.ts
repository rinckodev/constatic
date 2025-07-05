import type { PackageJson } from "pkg-types";
import type { EnvVarData } from "./env.js";

export interface BotProjectPreset {
    name: string; 
    hint: string; 
    icon: string;
    packageJson: PackageJson;
    env?: EnvVarData[],
    disabled?: boolean;
    path?: string;
}

export interface BotLibDatabasePreset extends BotProjectPreset {
    isORM: false;
    path: string;
}

export interface BotORMDatabasePreset extends BotProjectPreset {
    isORM: true;
    databases: Record<string, BotLibDatabasePreset>;
}

export interface BotAPIServerPreset extends BotProjectPreset {
    path: string;
}

export type BotDatabasePreset = BotLibDatabasePreset | BotORMDatabasePreset;