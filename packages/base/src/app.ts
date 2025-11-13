import type { CommandInteraction } from "discord.js";
import { CommandManager } from "./creators/commands/manager.js";
import type { GenericResponderInteraction } from "./creators/responders/handlers.js";
import { ResponderManager } from "./creators/responders/manager.js";
import { Router } from "./utils/router.js";

export interface BaseCommandsConfig {
    guilds?: string[];
    verbose?: boolean;
    middleware?(interaction: CommandInteraction, block: ()=> void): Promise<void>;
    onNotFound?(interaction: CommandInteraction): void;
    onError?(error: unknown, interaction: CommandInteraction): void;
}

export interface BaseRespondersConfig {
    middleware?(interaction: GenericResponderInteraction, block: ()=> void, params: object): Promise<void>;
    onNotFound?(interaction: GenericResponderInteraction): void;
    onError?(error: unknown, interaction: GenericResponderInteraction, params: object): void;
}

interface BaseConfig {
    commands: BaseCommandsConfig;
    responders: BaseRespondersConfig;
}

export class ConstaticApp {
    readonly commands = new CommandManager();
    readonly responders = new ResponderManager();
    readonly events = new Router();
    public readonly config: BaseConfig;
    private static "~instance": ConstaticApp | null = null;
    static getInstance(){
        return this["~instance"]??=new ConstaticApp();
    }
    private constructor(){
        this.config = {
            commands: {},
            responders: {}
        }
    }
    public static destroy(){
        this["~instance"]=null;
    }
}