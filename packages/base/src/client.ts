import { Client, type ClientOptions } from "discord.js";
import { styleText } from "node:util";
import { ConstaticApp } from "./app.js";

export interface CustomClientOptions extends Partial<ClientOptions> {}

export function createClient(token: string, options: CustomClientOptions){
    const app = ConstaticApp.getInstance();
    
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
        await app.commands.register(client);
        await app.events.runReady(client);
    });

    client.on("interactionCreate", async interaction => {
        if (interaction.isAutocomplete()){
            await app.commands.onAutocomplete(interaction);
            return;
        }
        if (interaction.isCommand()){
            await app.commands.onCommand(interaction);
            return;
        }
        await app.responders.onResponder(interaction);
    })
    return client;
}