import { ApplicationCommandType } from "discord.js";
import { Command } from "#base";

new Command({
	name: "ping",
	description: "Reply with pong",
	dmPermission: false,
	type: ApplicationCommandType.ChatInput,
	async run(interaction) {
		interaction.reply({ ephemeral, content: "pong" });
	}
});
