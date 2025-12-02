import type { ApplicationCommandType, CacheType, ClientEvents, PermissionResolvable } from "discord.js";
import { ConstaticApp, type BaseCommandsConfig, type BaseEventsConfig, type BaseRespondersConfig } from "../app.js";
import { Command, type CommandData, type CommandType } from "./commands/command.js";
import { Event, type EventData } from "./events/event.js";
import { Responder, type ResponderData, type ResponderType } from "./responders/responder.js";

export interface SetupCreatorsOptions {
    commands?: BaseCommandsConfig & {
        defaultMemberPermissions?: PermissionResolvable[];
    };
    responders?: Partial<BaseRespondersConfig>;
    events?: Partial<BaseEventsConfig>;
}
/**
 * Initializes the Constatic command/event/responder creation system.
 *
 * This function configures the Constatic application’s internal registries
 * for commands, events, and responders, and returns a set of factory
 * functions used to create each type of component.
 *
 * It also:
 * - Applies optional default command permissions
 * - Merges user-provided config into the ConstaticApp instance
 * - Automatically injects `process.env.GUILD_ID` into guild-restricted commands
 * - Ensures `"clientReady"` events always run once
 *
 * **Returned creators:**
 * - `createCommand(data)` — Registers a new slash command (or other command type)
 * - `createEvent(data)` — Registers a Discord.js event listener
 * - `createResponder(data)` — Registers an interaction responder (buttons, modals, etc.)
 *
 * @example
 * import { setupCreators } from "@constatic/base";
 * 
 * export const { createCommand, createResponder, createEvent } = setupCreators();
 */
export function setupCreators(options: SetupCreatorsOptions = {}) {
    const app = ConstaticApp.getInstance();
    app.config.commands = { ...options.commands ??= {} };
    app.config.commands.guilds ??= [];
    app.config.responders = { ...options.responders ??= {} };
    app.config.events = { ...options.events ??= {} };

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

