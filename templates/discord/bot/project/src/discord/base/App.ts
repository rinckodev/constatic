import { Command, Event, Responder, ResponderType, type ResponderInteraction } from "#base";
import { log, onError } from "#settings";
import { CustomItents, CustomPartials, spaceBuilder, toNull } from "@magicyan/discord";
import ck from "chalk";
import { CacheType, Client, type ClientOptions, version as djsVersion } from "discord.js";
import glob from "fast-glob";

interface BootstrapAppOptions extends Partial<ClientOptions> {
    /** Application entry point directory */
    workdir: string;
    /** Commands options */
	commands?: {
		/** Register commands in guilds */
		guilds?: string[]
	},
    /** Responders options */
	responders?: {
        onNotFound?(interaction: ResponderInteraction<ResponderType, CacheType>): void
	},
	/**
	 * A list of paths that will be imported to load the project's structure classes
	 * 
	 * The paths are relative to the **workdir** folder
	 */
    directories?: string[];
    /** Send load logs in terminal */
    loadLogs?: boolean;
    /** Run before load directories */
    beforeLoad?(client: Client): void
    /** Run when client is ready */
    whenReady?(client: Client<true>): void;
}
export async function bootstrapApp<O extends BootstrapAppOptions>(options: O){
    if (options.responders){
        Responder.setup({
            onNotFound: options.responders.onNotFound
        });
    }
    const client = createClient(process.env.BOT_TOKEN, options);
    await loadDirectories(options);
    
    console.log();
    log.success(spaceBuilder("📦",
        `${ck.hex("#5865F2").underline("discord.js")} ${ck.yellow(djsVersion)}`,
        "/",
        `${ck.hex("#68a063").underline("NodeJs")} ${ck.yellow(process.versions.node)}`,
    ));

    Event.register(client);
    client.login();
}
type LoadDirsOptions = Pick<BootstrapAppOptions, "workdir" | "directories" | "loadLogs">;
async function loadDirectories(options: LoadDirsOptions) {
    const { workdir, directories=[], loadLogs=true } = options;
    const pattern: string = "**/*.{ts,js,tsx,jsx}";
    const patterns: string[] = [
        `!./discord/base/*`, `./discord/${pattern}`,
        directories.map(p => p.replaceAll("\\", "/")).map(p => `./${p}/${pattern}`)
    ].flat();
    
    const paths: string[] = await glob(patterns, { absolute: true, cwd: workdir });
    await Promise.all(paths.map(path => import(`file://${path}`)));

    if (loadLogs??true){
        Command.loadLogs(); Event.loadLogs(); Responder.loadLogs();
    }
}
function createClient(token: string, options: BootstrapAppOptions): Client {
    const client = new Client(Object.assign(options, {
        intents: options.intents ?? CustomItents.All,
        partials: options.partials ?? CustomPartials.All,
        failIfNotExists: options.failIfNotExists ?? false
    }));
    client.token=token;

    if (options.beforeLoad) options.beforeLoad(client);

    client.on("ready", async (client) => {
        const messages: string[] = [];
        const addMessage = (text: string) => messages.push(text);
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
        for(const message of messages) log.log(ck.green(` ${message}`));
        
        process.on("uncaughtException", err => onError(err, client));
        process.on("unhandledRejection", err => onError(err, client));
        
        options.whenReady?.(client);
    });
    client.on("interactionCreate", async (interaction) => {
        switch(true){
            case interaction.isAutocomplete(): Command.onAutocomplete(interaction); return;
            case interaction.isCommand(): Command.onCommand(interaction); return;
            default: Responder.onInteraction(interaction); return;
        }
    });
    return client;
}