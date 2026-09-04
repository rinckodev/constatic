import { pkg } from "#utils/pkg.js";
import Conf from "conf";
import { dirname } from "node:path";
import type { DiscordBotToken } from "../shared/token.js";

export interface ScriptPreset {
    id: string;
    type: "default";
    alias?: string;
    name: string;
    files: {
        path: string;
        dist?: string;
    }[];
    packageJson?: {
        dependencies?: Record<string, string>,
        devDependencies?: Record<string, string>
    }
}

export interface ScriptPresetFile {
    path: string;
    dist?: string;
}

interface ConfigSchema {
    "discord.bot.tokens": DiscordBotToken[]
    "presets.scripts": ScriptPreset[]
}

class Config extends Conf<ConfigSchema> {
    constructor(){
        super({
            projectName: pkg.name,
            defaults: {
                "discord.bot.tokens": [],
                "presets.scripts": []
            }
        })
    }
    dirname(){
        return dirname(this.path);
    }
    getToken(name: string){
        return this.get("discord.bot.tokens", []).find(
            t => t.name.toLowerCase() === name.toLowerCase()
        );
    }
}

export const programConfig = new Config();