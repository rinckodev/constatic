import { env } from "#env";
import { CustomItents, CustomPartials } from "@magicyan/discord";
import ck from "chalk";
import { Client, ClientOptions, version as djsVersion } from "discord.js";
import { Constatic } from "./app.js";
import { baseErrorHandler } from "./base.error.js";
import { runtimeDisplay } from "./base.version.js";
import { BaseCommandHandlers } from "./commands/handlers.js";
import "./constants.js";
import { BaseEventHandlers } from "./events/handlers.js";
import { BaseResponderHandlers } from "./responders/handlers.js";
import { glob } from "node:fs/promises";
import { join } from "node:path";

interface BootstrapOptions extends Partial<ClientOptions> {
    meta: ImportMeta;
    modules?: string[];
    loadLogs?: boolean;
    beforeLoad?(client: Client): Promise<void>;
}
export async function bootstrap(options: BootstrapOptions){
    const { meta, modules, beforeLoad, loadLogs=true, ...clientOptions } = options;

    const client = new Client({ ...clientOptions,
        intents: options.intents ?? CustomItents.All,
        partials: options.partials ?? CustomPartials.All,
        failIfNotExists: options.failIfNotExists ?? false,
    });

    const app = Constatic.getInstance();

    client.once("clientReady", async (client) => {
        registerErrorHandlers(client);
        await client.guilds
            .fetch()
            .catch(() => null);
            
        console.log(ck.green(`● ${ck.greenBright.underline(client.user.username)} online ✓`))
        
        await BaseCommandHandlers.register(client);

        await Promise.all(Array.from(app.events.getEvents("clientReady").values())
            .map(data => BaseEventHandlers.handler(data, [client]))
        );
    });

    client.on("interactionCreate", async (interaction) => {
        if (interaction.isAutocomplete()){
            await BaseCommandHandlers.autocomplete(interaction);
            return;
        }
        if (interaction.isCommand()){
            await BaseCommandHandlers.command(interaction);
            return;
        }
        await BaseResponderHandlers.handler(interaction);
    });
    
    if (beforeLoad){
        await beforeLoad(client);
    }
    await loadModules(meta.dirname, modules);
    
    if (loadLogs) app.printLoadLogs();
    
    console.log();
    console.log(ck.blue(`★ Constatic Base ${ck.reset.dim(env.BASE_VERSION)}`));
    console.log(
        `${ck.hex("#5865F2")("◌ discord.js")} ${ck.dim(djsVersion)}`,
        "|",
        runtimeDisplay
    );
    
    BaseEventHandlers.register(client);

    client.login(env.BOT_TOKEN);

    return { client };
}

async function loadModules(workdir: string, modules: string[] = []) {
    const files = await Array.fromAsync(glob([
        "./discord/**/*.{js,ts,jsx,tsx}",
        ...modules,
    ], {
        cwd: workdir,
        exclude: [
            "./discord/index.*",
            "./discord/base/**/*"
        ]
    }));
    await Promise.all(files.map(path => 
        import(`file://${join(workdir, path)}`)
    ));
}

function registerErrorHandlers(client?: Client<true>): void {
    const errorHandler = client 
        ? (err: unknown) => baseErrorHandler(err, client)
        : baseErrorHandler;
    if (client) {
        process.removeListener("uncaughtException", baseErrorHandler);
        process.removeListener("unhandledRejection", baseErrorHandler);
    }
    process.on("uncaughtException", errorHandler);
    process.on("unhandledRejection", errorHandler);
}

registerErrorHandlers();