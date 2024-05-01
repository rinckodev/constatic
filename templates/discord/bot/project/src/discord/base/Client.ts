import { Command, Component, Event, Modal } from "./index.js";
import { CustomItents, CustomPartials } from "@magicyan/discord";
import { Client, ClientOptions, version } from "discord.js";
import path from "node:path";
import { log, onError } from "#settings";
import glob from "fast-glob";
import ck from "chalk";

const foldername = path.basename(path.join(import.meta.dirname, "../../"));

export function createClient(options: CreateClientOptions = {}){
	const { commands, ...clientOptions } = options;

	const client = new Client(Object.assign(clientOptions, {
		intents: clientOptions.intents ?? CustomItents.All,
		partials: clientOptions.partials ?? CustomPartials.All,
		failIfNotExists: false, closeTimeout: 0
	}));

	client.start = async function(options) {
		this.once("ready", async (client) => {
			process.on("uncaughtException", async (err) => onError(err, client));
			process.on("unhandledRejection", async (err) => onError(err, client));
			console.log();
			const versions = [
				`${ck.hex("#5865F2").underline("discord.js")} 📦 ${ck.yellow(version)}`,
				`${ck.hex("#68a063").underline("NodeJs")} ${ck.yellow(process.versions.node)}`,
			];
			log.success(`${ck.green("Bot online")} ${versions.join(" - ")}`);
			log.log(ck.greenBright(`➝ Connected as ${ck.hex("#57F287").underline(client.user.username)}`));
			console.log();

			if (commands?.guilds){
				const guilds = client.guilds.cache.filter(
					({ id }) => commands.guilds.includes(id)
				);
				await Command.registerGuildCommands(client, guilds);
			} else {
				await Command.registerGlobalCommands(client);
			}
			if (options?.whenReady) options.whenReady(client);
		});
		const { directories=[] } = clientOptions;
		const pattern = "**/*.{ts,js,tsx,jsx}";
		const patterns = [
			`./${foldername}/discord/${pattern}`, `!./${foldername}/discord/base/*`,
			directories.map(dir => path.join(foldername, dir))
			.map(p => p.replaceAll("\\", "/"))
			.map(p => `./${p}/${pattern}`)
		].flat();
		const paths = await glob(patterns, { absolute: true });

		await Promise.all(paths.map(async path => import(`file://${path}`)));
		Event.register(this);
	
		Command.logs(); Component.logs(); Modal.logs(); Event.logs();

		this.login(process.env.BOT_TOKEN);
	};
	client.on("interactionCreate", (interaction) => {
		if (interaction.isCommand()) Command.onCommand(interaction);
		if (interaction.isAutocomplete()) Command.onAutocomplete(interaction);
		if (interaction.isMessageComponent()) Component.onComponent(interaction);
		if (interaction.isModalSubmit()) Modal.onModal(interaction);
	});
	return client;
}

interface CreateClientOptions extends Partial<ClientOptions> {
	/**
	 * Commands options
	 */
	commands?: {
		/**
		 * Register commands in guilds
		 */
		guilds: string[]
	},
	/**
	 * A list of paths that will be imported to load the project's structure classes
	 * 
	 * The paths are relative to the src/dist folder
	 */
	directories?: string[];
}