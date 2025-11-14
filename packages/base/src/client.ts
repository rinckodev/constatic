import { Client, type ClientOptions } from "discord.js";
import { styleText } from "node:util";
import { BaseCommandHandlers } from "./creators/commands/handlers.js";
import { BaseEventHandlers } from "./creators/events/handlers.js";
import { BaseResponderHandlers } from "./creators/responders/handlers.js";

export interface CustomClientOptions extends Partial<ClientOptions> {}

export function createClient(token: string, options: CustomClientOptions){
    const client = new Client({ ...options,
        intents: options.intents??[],
        partials: options.partials??[],
        failIfNotExists: options.failIfNotExists ?? false,
    });
    client.token = token;

    client.once("clientReady", async (client) => {
        console.log("%s %s %s",
            styleText("green", "●"),
            styleText(["greenBright", "underline"], client.user.username),
            styleText("green", "application is ready!")
        );
        await BaseCommandHandlers.register(client);
        await BaseEventHandlers.runReady(client);
    });

    client.on("interactionCreate", async interaction => {
        if (interaction.isAutocomplete()){
            await BaseCommandHandlers.onAutocomplete(interaction);
            return;
        }
        if (interaction.isCommand()){
            await BaseCommandHandlers.onCommand(interaction);
            return;
        }
        await BaseResponderHandlers.onResponder(interaction);
    })
    return client;
}