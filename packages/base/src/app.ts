import { version } from "#package";
import type { Client, CommandInteraction } from "discord.js";
import { version as djsVersion } from "discord.js";
import { styleText } from "node:util";
import { CommandManager } from "./creators/commands/manager.js";
import type { EventPropData } from "./creators/events/event.js";
import { EventManager } from "./creators/events/manager.js";
import { ResponderManager, type GenericResponderInteraction } from "./creators/responders/manager.js";
import { baseErrorHandler } from "./error.js";

declare const Bun: { version: string };
const isBun = typeof Bun !== "undefined";

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

export interface BaseEventsConfig {
    middleware?(event: EventPropData, block: (...tags: string[]) => void): Promise<void>;
    onError?(error: unknown, event: EventPropData): void;
}

export type BaseErrorHandler = (error: Error | unknown, client: Client) => void;

export interface BaseConfig {
    commands: BaseCommandsConfig;
    events: BaseEventsConfig;
    responders: BaseRespondersConfig;
    errorHandler: BaseErrorHandler;
}

export class ConstaticApp {
    readonly commands = new CommandManager(this);
    readonly responders = new ResponderManager(this);
    readonly events = new EventManager(this);
    public readonly config: BaseConfig;
    private static "~instance": ConstaticApp | null = null;
    static getInstance(){
        return this["~instance"]??=new ConstaticApp();
    }
    private constructor(){
        this.config = {
            commands: {},
            responders: {},
            events: {},
            errorHandler: baseErrorHandler,
        }
    }
    public static destroy(){
        this["~instance"]=null;
    }
    public setErrorHandler(handler: BaseErrorHandler){
        this.config.errorHandler = handler;
    }
    public intro(){
        console.log("%s %s",
            styleText("blue", "★ Constatic Base"),
            styleText("dim", version),
        );
        console.log("%s %s | %s %s",
            styleText("blueBright", "◌ discord.js"),
            styleText("dim", djsVersion),
            isBun ? "◌ Bun" : styleText("green", "⬢ Node.js"),
            styleText("dim", isBun ? Bun.version : process.versions.node)
        );
        console.log();
    }
}