import type { ApplicationCommandType, CacheType, ClientEvents, PermissionResolvable } from "discord.js";
import { ConstaticApp, type BaseCommandsConfig, type BaseEventsConfig, type BaseRespondersConfig } from "../app.js";
import { Command, type CommandData, type CommandType } from "./commands/command.js";
import { Event, type EventData } from "./events/event.js";
import { Responder, type ResponderData, type ResponderType } from "./responders/responder.js";

interface SetupCreatorsOptions {
    commands?: BaseCommandsConfig & {
        defaultMemberPermissions?: PermissionResolvable[];
    };
    responders?: Partial<BaseRespondersConfig>;
    events?: Partial<BaseEventsConfig>;
}

export function setupCreators(options: SetupCreatorsOptions = {}) {
    const app = ConstaticApp.getInstance();
    app.config.commands = { ...options.commands ??= {} };
    app.config.commands.guilds ??= [];

    if (process.env.GUILD_ID?.length) {
        app.config.commands.guilds.push(
            process.env.GUILD_ID
        );
    }
    return {
        createCommand<
            T extends CommandType = ApplicationCommandType.ChatInput,
            P extends boolean = false,
            R = void
        >(data: CommandData<T, P, R>): Command<T, P, R> {
            if (options.commands?.defaultMemberPermissions){
                data.defaultMemberPermissions??=options.commands
                    .defaultMemberPermissions;
            }
            const command = new Command(data);
            app.commands.set(command);
            return command;
        },
        createEvent: function <
            EventName extends keyof ClientEvents
        >(data: EventData<EventName>) {
            if (data.event === "clientReady") {
                data.once = true;
            }
            const event = new Event(data);
            app.events.add(event);
            return event;
        },
        createResponder<
            Path extends string,
            const Types extends readonly ResponderType[],
            Parsed,
            Cache extends CacheType = CacheType
        >(data: ResponderData<Path, Types, Parsed, Cache>) {
            const responder = new Responder(data);
            app.responders.set(responder);
            return responder;
        },
    }
}

export { ResponderType } from "./responders/responder.js";
