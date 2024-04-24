import { Command, Component, Event, Modal } from "./index.js";
import { CustomItents, CustomPartials } from "@magicyan/discord";
import { Client, ClientOptions, version } from "discord.js";
import { basename, join } from "node:path";
import { log, onError } from "#settings";
import glob from "fast-glob";
import ck from "chalk";

const foldername = basename(join(import.meta.dirname, "../../"));

interface GuildCommandsMethod {
	type: "guild",
	guilds: string[]
}
interface GlobalCommandsMethod {
	type: "global",
}
type CommandsMethod = GuildCommandsMethod | GlobalCommandsMethod;
interface CreateClientOptions extends Partial<ClientOptions> {
	commandsMethod?: CommandsMethod
}
export function createClient(options: CreateClientOptions = {}) {
	const { intents, partials, commandsMethod={ type: "global" }, ...otherOptions } = options;
	const client = new Client(Object.assign({
		intents: intents ?? CustomItents.All,
		partials: partials ?? CustomPartials.All,
		failIfNotExists: false, closeTimeout: 0,
	}, otherOptions));

	client.start = async function(options) {
		this.once("ready", async (client) => {
			process.on("uncaughtException", async (err) => onError(err, client));
			process.on("unhandledRejection", async (err) => onError(err, client));
			console.log();
			log.success(
				`${ck.green("Bot online")} ${ck.blue.underline("discord.js")} 📦 ${ck.yellow(version)} \n`,
				`${ck.greenBright(`➝ Connected as ${ck.underline(client.user.username)}`)}`
			);
			console.log();

			if (commandsMethod.type === "guild"){
				const guilds = client.guilds.cache.filter(
					({ id }) => commandsMethod.guilds.includes(id)
				);
				await Command.registerGuildCommands(client, guilds);
			} else {
				await Command.registerGlobalCommands(client);
			}
			

			if (options?.whenReady) options.whenReady(client);
		});
		const patterns = [`./${foldername}/discord/**/*.{ts,js}`, `!./${foldername}/discord/base/*`];
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