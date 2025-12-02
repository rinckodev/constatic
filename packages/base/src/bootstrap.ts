import { type Client } from "discord.js";
import { ConstaticApp, type BaseErrorHandler } from "./app.js";
import { createClient, type CustomClientOptions } from "./client.js";
import { ConstaticError } from "./error.js";
import { loadModules } from "./modules.js";

export interface BootstrapOptions extends CustomClientOptions {
    /**
     * The caller module's `import.meta`.
     * Internally used for resolving file paths when dynamically loading modules.
     */
    meta: ImportMeta;
    /**
     * The Discord bot token.
     * If omitted, bootstrap will attempt to use:
     * - `env.BOT_TOKEN`
     * - `process.env.BOT_TOKEN`
     */
    token?: string;
    /**
     * A custom error handler that overrides the default one
     * configured by `ConstaticApp`.
     *
     * If provided, all global errors such as:
     * - `uncaughtException`
     * - `unhandledRejection`
     *
     * will be handled by this function.
     */
    errorHandler?: BaseErrorHandler;
    /**
     * A hook executed before loading the modules.
     * Can be used to register services, prepare caches,
     * validate dependencies, or modify the client before initialization.
     */
    beforeLoad?(client: Client<boolean>): Promise<void>;
    /**
     * Additional glob patterns used to load application modules.
     */
    modules?: string[];
    /**
     * Whether initialization logs should be displayed.
     * Defaults to `true`.
     */
    loadLogs?: boolean;
    /**
     * Custom environment variables that may complement or override
     * values from `process.env`.
     */
    env?: Record<string, any>
}

/**
 * 
 * Bootstraps and initializes a Constatic application, creating the Discord client,
 * loading modules, registering events, and applying global error handlers.
 * 
 * @example
 * import { bootstrap } from "@constatic/base";
 * 
 * await bootstrap({ meta: import.meta });
 * 
 * @example
 * import { env } from "#env";
 * import { bootstrap } from "@constatic/base";
 * 
 * await bootstrap({ meta: import.meta, env });
 */
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