import type { CommandInteraction } from "discord.js";
import { CommandManager } from "./creators/commands/manager.js";
import { Router } from "./utils/router.js";

export interface BaseCommandsConfig {
    guilds?: string[];
    verbose?: boolean;
    middleware?(interaction: CommandInteraction, block: ()=> void): Promise<void>;
    onNotFound?(interaction: CommandInteraction): void;
    onError?(error: unknown, interaction: CommandInteraction): void;
}

interface BaseConfig {
    commands: BaseCommandsConfig;
}

export class ConstaticApp {
    readonly commands = new CommandManager();
    readonly events = new Router();
    readonly responders = new Router();
    public readonly config: BaseConfig;
    private static "~instance": ConstaticApp | null = null;
    static getInstance(){
        return this["~instance"]??=new ConstaticApp();
    }
    private constructor(){
        this.config = {
            commands: {}
        }
    }
    public static destroy(){
        this["~instance"]=null;
    }
}