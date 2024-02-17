import { BitFieldResolvable, Client, GatewayIntentsString, Partials, version as discordjsVersion} from "discord.js";
import { CustomItents, CustomPartials } from "@magicyan/discord";
import { Command, Component, Event, Listener, Modal } from "./index.js";
import { basename, join } from "node:path";
import { log } from "#settings";
import glob from "fast-glob";
import ck from "chalk";

const foldername = basename(join(getDirname(import.meta), "../../"));

interface CreateClientOptions {
	intents?: BitFieldResolvable<GatewayIntentsString, number>;
	partials?: Partials[]
}
export function createClient(options: CreateClientOptions = {}) {
	const client = new Client({
		intents: options.intents ?? CustomItents.All,
		partials: options.partials ?? CustomPartials.All,
		failIfNotExists: false,
		closeTimeout: 0,
	});

	client.start = async function (options) {
		this.once("ready", async (readyClient) => {
			console.log();
			log.success(
				`${ck.green("Bot online")} ${ck.blue.underline("discord.js")} 📦 ${ck.yellow(discordjsVersion)} \n`,
				`${ck.greenBright(`➝ Connected as ${ck.underline(readyClient.user.username)}`)}`
			);
			console.log();

			await readyClient.application.commands.set(Array.from(Command.commands.values()))
			.then(() => log.success(ck.green("Commands registered successfully!")))
			.catch(log.error);

			if (options?.whenReady) options.whenReady(readyClient);
		});
		const paths = await glob(
			[
				`./${foldername}/discord/**/*.{ts,js}`,
				`!./${foldername}/discord/base/*`
			],
			{ absolute: true }
		);

		await Promise.all(paths.map(async path => import(`file://${path}`)));
	
		Event.register(this);
		Listener.register(this);
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