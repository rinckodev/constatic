import Conf from "conf";
import { DiscordBotToken } from "../shared/token.js";
import { pkg } from "#utils/pkg.js";
import { dirname } from "node:path";

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