import { type Client } from "discord.js";
import { ConstaticApp, type BaseErrorHandler } from "./app.js";
import { createClient, type CustomClientOptions } from "./client.js";
import { ConstaticError } from "./error.js";
import { loadModules } from "./modules.js";

export interface BootstrapOptions extends CustomClientOptions {
    token?: string;
    meta: ImportMeta;
    errorHandler?: BaseErrorHandler;
    beforeLoad?(client: Client<boolean>): Promise<void>;
    modules?: string[];
    loadLogs?: boolean;
    env?: Record<string, string|undefined>
}

export async function bootstrap(options: BootstrapOptions) {
    const token = options.token 
        ?? options.env?.BOT_TOKEN 
        ?? process.env?.BOT_TOKEN;

    if (!token) throw new ConstaticError(
        "The application token was not provided!"
    );

    const app = ConstaticApp.getInstance();
    if (options.errorHandler){
        app.setErrorHandler(options.errorHandler);
    }

    const client = createClient(token, options);

    process.on("uncaughtException", error => 
        app.config.errorHandler(error, client)
    );
    process.on("unhandledRejection", error => 
        app.config.errorHandler(error, client)
    );

    if (options.beforeLoad){
        await options.beforeLoad(client);
    }

    const imports = await loadModules(options.meta, [
        "./discord/**/*.{js,ts,jsx,tsx}",
        "!./discord/index.{js,ts,jsx,tsx}",
        ...options.modules??[]
    ]);
    if (options.loadLogs??true){
        app.printLogs();
    }
    app.intro();
    app.events.register(client);
    
    client.login();

    return { client, imports };
}