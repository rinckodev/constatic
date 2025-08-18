import { ApplicationCommandOptionType, ApplicationCommandType, CacheType, ClientEvents, PermissionResolvable } from "discord.js";
import { type BaseCommandsConfig, type BaseEventsConfig, type BaseRespondersConfig, Constatic } from "./app.js";
import { AppCommandData, CommandInstance, CommandType, SubCommandGroupModuleData, SubCommandModuleData } from "./commands/types.js";
import { ResponderData, ResponderType } from "./responders/types.js";
import { EventData } from "./events/types.js";
import { env } from "#env";

interface SetupCreatorsOptions {
    commands?: Partial<BaseCommandsConfig> & {
        defaultMemberPermissions?: PermissionResolvable[];
    };
    responders?: Partial<BaseRespondersConfig>;
    events?: Partial<BaseEventsConfig>;
}
export function setupCreators(options: SetupCreatorsOptions = {}){
    const app = Constatic.getInstance();

    app.config.commands = { ...options.commands };

    if (env.GUILD_ID) {
        (app.config.commands.guilds??=[]).push(env.GUILD_ID)
    }

    app.config.responders = { ...options.responders };
    app.config.events = { ...options.events };

    const defaultPerms = options.commands?.defaultMemberPermissions;

    return {
        createCommand: function<
            T extends CommandType = ApplicationCommandType.ChatInput,
            P extends boolean = false,
            R = void
        >(data: AppCommandData<T, P, R>): CommandInstance<T, P, R> {
            if (defaultPerms){
                data.defaultMemberPermissions??=defaultPerms
            }

            const resolved = app.commands.set(data);
            app.commands.addLog(resolved);

            if (resolved.type !== ApplicationCommandType.ChatInput){
                return resolved as CommandInstance<T, P, R>;
            }
            const commandName = resolved.name;
            
            const createSubcommand = <R>(group?: string) => {
                return function(data: SubCommandModuleData<P, R>){
                    app.commands.addModule(commandName, {
                        ...data, group,
                        type: ApplicationCommandOptionType.Subcommand,
                    })
                }
            }
            return Object.assign(data, { ...resolved,
                group<W = R>(data: SubCommandGroupModuleData<P, R, W>){
                    app.commands.addModule(commandName, { ...data,
                        type: ApplicationCommandOptionType.SubcommandGroup,
                    });
                    return { subcommand: createSubcommand<W>(data.name) }
                },
                subcommand: createSubcommand<R>()
            });
        },
        createEvent: function<
            EventName extends keyof ClientEvents
        >(data: EventData<EventName>){
            const resolved = { ...data, 
                once: data.event === "ready" 
                    ? true : data.once
            };
            app.events.addLogs(resolved);
            return app.events.add(resolved);
        },
        createResponder: function<
            Path extends string, 
            const Types extends readonly ResponderType[], 
            Schema, 
            Cache extends CacheType = CacheType,
        >(data: ResponderData<Path, Types, Schema, Cache>){
            app.responders.addLogs(data);
            return app.responders.add(data);
        },
    }
}