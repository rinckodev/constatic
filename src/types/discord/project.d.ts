import { PackageJson } from "pkg-types";

export interface BotProjectPreset {
    name: string; 
    hint: string; 
    icon: string;
    packageJson: PackageJson;
    env?: {
        schema: string;
        file: string;
    },
    disabled?: boolean;
}