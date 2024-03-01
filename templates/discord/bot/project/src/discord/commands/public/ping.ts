import { Command } from "#base";
import { createRow } from "@magicyan/discord";
import { ApplicationCommandType, ButtonBuilder, ButtonStyle } from "discord.js";

new Command({
	name: "ping",
	description: "🏓 replies with pong",
	dmPermission: false,
	type: ApplicationCommandType.ChatInput,
	async run(interaction){

		const row = createRow(
			new ButtonBuilder({
				customId: `remind/${new Date().toISOString()}`,
				label: "Ping",
				style: ButtonStyle.Success
			})
		);

		interaction.reply({ ephemeral, content: "pong", components: [row] });
	}
});