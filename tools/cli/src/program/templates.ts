import { json } from "#helpers";
import { programroot } from "#root";
import { join } from "node:path";
import type { PackageJson } from "pkg-types";

export type EnvVarData = [
    key: string, 
    value: string, 
    defaultValue?: string
]

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

export interface BotTemplateProperties {
    presets: {
        databases: Record<string, BotDatabasePreset>;
        servers: Record<string, BotServerPreset>
    }
}

const path = join(programroot, "templates/discord/bot");
const props = await json.read<BotTemplateProperties>(
    join(path, "properties.json")
);

export const programTemplates = Object.freeze({
    path, props
});