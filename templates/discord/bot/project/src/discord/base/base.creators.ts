import { ApplicationCommandType, CacheType, ClientEvents, Collection, PermissionResolvable } from "discord.js";
import { addRoute } from "rou3";
import { baseCommandLog, CommandData, CommandType } from "./base.command.js";
import { baseEventLog, EventData } from "./base.event.js";
import { baseResponderLog, ResponderData, ResponderType } from "./base.responder.js";
import { baseStorage } from "./base.storage.js";
import { BaseStorageCommandConfig, BaseStorageEventsConfig, BaseStorageRespondersConfig } from "./base.types.js";

interface CommandCreatorOptions extends Partial<BaseStorageCommandConfig> {
    defaultMemberPermissions?: PermissionResolvable[];
}

interface ResponderCreatorOptions extends Partial<BaseStorageRespondersConfig> {}

interface EventCreatorOptions extends Partial<BaseStorageEventsConfig> {}

interface SetupCreatorsOptions {
    commands?: CommandCreatorOptions;
    responders?: ResponderCreatorOptions;
    events?: EventCreatorOptions;
}
export function setupCreators(options: SetupCreatorsOptions = {}){
    
    /** @commands */
    baseStorage.config.commands.guilds = options.commands?.guilds??[];
    baseStorage.config.commands.verbose = options.commands?.verbose
    baseStorage.config.commands.middleware = options.commands?.middleware;
    baseStorage.config.commands.onNotFound = options.commands?.onNotFound;
    baseStorage.config.commands.onError = options.commands?.onError;
    
    /** @responders  */
    baseStorage.config.responders.middleware = options.responders?.middleware;
    baseStorage.config.responders.onNotFound = options.responders?.onNotFound;
    baseStorage.config.responders.onError = options.responders?.onError;
    
    /** @events  */
    baseStorage.config.events.middleware = options.events?.middleware;
    baseStorage.config.events.onError = options.events?.onError;

    return {
        createCommand: function<
            Name extends string = string, 
            DmPermission extends boolean = false,
            Type extends CommandType = ApplicationCommandType.ChatInput
        >(data: CommandData<Name, DmPermission, Type>){
            /** @defaults */
            data.type??=ApplicationCommandType.ChatInput as Type
            data.dmPermission??=false as DmPermission;
            if (options.commands?.defaultMemberPermissions){
                data.defaultMemberPermissions??=options.commands?.defaultMemberPermissions;
            }
            /** @store */
            baseStorage.commands.set(data.name, data);

            baseCommandLog(data);
            return data;
        },
        createEvent: function<
            EventName extends keyof ClientEvents
        >(data: EventData<EventName>){
            /** @store */
            const events = baseStorage.events.get(data.event) ?? new Collection();
            events.set(data.name, data);
            baseStorage.events.set(data.event, events);

            baseEventLog(data);
            return data;
        },
        createResponder: function<
            Path extends string, 
            const Types extends readonly ResponderType[], 
            Schema, 
            Cache extends CacheType = CacheType,
        >(data: ResponderData<Path, Types, Schema, Cache>){
            /** @store */
            const { customId } = data;

            const types = Array.from(new Set(data.types).values());

            for(const type of types){
                addRoute(baseStorage.responders, type, customId, data);
                baseResponderLog(customId, type);
            };

            return data;
        },
    }
}