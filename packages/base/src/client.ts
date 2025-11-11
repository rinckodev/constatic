import { Client, IntentsBitField, type ClientOptions } from "discord.js";

export interface CustomClientOptions extends Omit<ClientOptions, "intents"> {
    intents?: ClientOptions["intents"]
}

export function createClient(token: string, options: ClientOptions){
    const client = new Client({
        ...options,
        intents: options.intents ?? IntentsBitField.Flags,
        failIfNotExists: options.failIfNotExists ?? false,
    });
    client.token = token;
    return client;
}