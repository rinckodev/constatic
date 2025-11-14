import { type Client } from "discord.js";
import { glob } from "node:fs/promises";
import { createClient, type CustomClientOptions } from "./client.js";
import { BaseEventHandlers } from "./creators/events/handlers.js";
import { ConstaticError } from "./error.js";

export interface BootstrapOptions extends CustomClientOptions {
    token?: string;
    meta: ImportMeta;
    errorHandler?(error: Error, client: Client<true>): void;
    beforeLoad?(client: Client<boolean>): Promise<void>;
    modules?: string[];
}

export async function bootstrap(options: BootstrapOptions) {
    const token = options.token ?? process.env.BOT_TOKEN;

    if (!token) throw new ConstaticError(
        "The application token was not provided!"
    );

    const client = createClient(token, options);

    if (options.beforeLoad){
        await options.beforeLoad(client);
    }

    const modules = [
        ...options.modules ?? [],
        "./discord/**/*.{js,ts,jsx,tsx}"
    ];
    const filepaths = await Array.fromAsync(
        glob(modules, { cwd: options.meta.dirname })
    );
    const promises = filepaths.map(filepath => 
        import(options.meta.resolve(filepath))
            .then(imported => ({
                module: imported,
                filepath
            }))
    );
    const imports = await Promise.all(promises);
    
    BaseEventHandlers.register(client);
    
    client.login();

    return { client, imports };
}