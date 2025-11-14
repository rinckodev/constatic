import type { Client, CommandInteraction } from "discord.js";
import { CommandManager } from "./creators/commands/manager.js";
import type { EventPropData } from "./creators/events/event.js";
import { EventManager } from "./creators/events/manager.js";
import type { GenericResponderInteraction } from "./creators/responders/handlers.js";
import { ResponderManager } from "./creators/responders/manager.js";

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

interface BaseConfig {
    commands: BaseCommandsConfig;
    events: BaseEventsConfig;
    responders: BaseRespondersConfig;
    errorHandler: BaseErrorHandler;
}

export class ConstaticApp {
    readonly commands = new CommandManager();
    readonly responders = new ResponderManager();
    readonly events = new EventManager();
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
            errorHandler(){}
        }
    }
    public static destroy(){
        this["~instance"]=null;
    }
    public setErrorHandler(handler: BaseErrorHandler){
        this.config.errorHandler = handler;
    }
}