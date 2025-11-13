import type { ApplicationCommandType, PermissionResolvable } from "discord.js";
import { ConstaticApp, type BaseCommandsConfig } from "../app.js";
import { Command, type CommandData, type CommandType } from "./commands/command.js";

interface SetupCreatorsOptions {
    commands?: BaseCommandsConfig & {
        defaultMemberPermissions?: PermissionResolvable[];
    };
}

export function setupCreators(options: SetupCreatorsOptions = {}){
    const app = ConstaticApp.getInstance();
    app.config.commands = { ...options.commands??={} };
    app.config.commands.guilds??=[];

    if (process.env.GUILD_ID?.length){
        app.config.commands.guilds.push(
            process.env.GUILD_ID
        );
    }

    return {
        createCommand<
            T extends CommandType = ApplicationCommandType.ChatInput, 
            P extends boolean = false,
            R = void
        >(data: CommandData<T, P, R>){
            const command = new Command<T, P, R>(data);

            app.commands.set(command);
            
            return command;
        },
        createResponder(){

        },
        createEvent(){

        }
    }
}