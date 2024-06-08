import { Command, Event, Responder } from "#base";
import { CustomItents, CustomPartials, spaceBuilder, toNull } from "@magicyan/discord";
import { Client, ClientOptions, version as djsVersion } from "discord.js";
import { log, onError } from "#settings";
import ck from "chalk";
import glob from "fast-glob";
import path from "node:path";

type R<O extends BootstrapAppOptions> = O["multiple"] extends true ? Client[] : Client;

interface BootstrapAppOptions extends Partial<ClientOptions> {
    workdir: string;
    /**
	 * Commands options
	 */
	commands?: {
		/**
		 * Register commands in guilds
		 */
		guilds?: string[]
	},
	/**
	 * A list of paths that will be imported to load the project's structure classes
	 * 
	 * The paths are relative to the src/dist folder
	 */
    directories?: string[];
    /**
     * Create multiple app instances
     */
    multiple?: boolean;
    /**
     * Send load logs in terminal
     */
    loadLogs?: boolean;
    /**
     * 
     * Run before load directories
     */
    beforeLoad?(client: Client): void
    whenReady?(client: Client<true>): void;
}
export async function bootstrapApp<O extends BootstrapAppOptions>(options: O): Promise<R<O>> {
    if (options.multiple){
        const clients: Client[] = [];
        for(const token of process.env.BOT_TOKEN.split(" ")){
            const client = createClient(token, options);
            clients.push(client);
        }
        await loadDirectories(path.basename(options.workdir), options.directories, options.loadLogs);
        
        clients.forEach(client => {
            Event.register(client);
            client.login();
        });
        return clients as R<O>;
    }
    const client = createClient(process.env.BOT_TOKEN, options);
    await loadDirectories(path.basename(options.workdir), options.directories, options.loadLogs);

    Event.register(client);
    client.login();
    
    return client as R<O>;
}
async function loadDirectories(foldername: string, directories: string[] = [], loadLogs?: boolean) {
    const pattern: string = "**/*.{ts,js,tsx,jsx}";
    const patterns: string[] = [
        `!./${foldername}/discord/base/*`,
        `./${foldername}/discord/${pattern}`,
        directories.map(dir => path.join(foldername, dir))
        .map(p => p.replaceAll("\\", "/"))
        .map(p => `./${p}/${pattern}`)
    ].flat();
    const paths: string[] = await glob(patterns, { absolute: true });
    await Promise.all(paths.map(path => import(`file://${path}`)));
    Responder.sortCustomIds();
    if (loadLogs??true){
        Command.loadLogs(); Event.loadLogs(); Responder.loadLogs();
    }
    const versions = [
        `${ck.hex("#5865F2").underline("discord.js")} ${ck.yellow(djsVersion)}`,
        "/",
        `${ck.hex("#68a063").underline("NodeJs")} ${ck.yellow(process.versions.node)}`,
    ];
    console.log();
    log.success(spaceBuilder("📦", versions));
}
function createClient(token: string, options: BootstrapAppOptions): Client {
    const client = new Client(Object.assign(options, {
        intents: options.intents ?? CustomItents.All,
        partials: options.partials ?? CustomPartials.All,
        failIfNotExists: false
    }));
    if (options.beforeLoad){
        options.beforeLoad(client);
    }
    client.on("ready", async (client) => {
        const messages: string[] = new Array();
        const addMessage = (message: string) => messages.push(message);
        await client.guilds.fetch().catch(toNull);
        if (options.commands?.guilds){
            const guilds = client.guilds.cache.filter(
                ({ id }) => options?.commands?.guilds?.includes(id)
            );
            await Command.register(addMessage, client, guilds);
        } else {
            await Command.register(addMessage, client);
        }
        log.log(ck.greenBright(`➝ Online as ${ck.hex("#57F287").underline(client.user.username)}`));
        for(const message of messages){
            log.log(ck.green(` ${message}`));
        }
        process.on("uncaughtException", err => onError(err, client));
        process.on("unhandledRejection", err => onError(err, client));
        if (options.whenReady) options.whenReady(client);
    });
    client.on("interactionCreate", async (interaction) => {
        if (interaction.isCommand()) Command.onCommand(interaction);
		if (interaction.isAutocomplete()) Command.onAutocomplete(interaction);
		Responder.onInteraction(interaction);
    });
    Object.assign(client, { token });
    return client;
}