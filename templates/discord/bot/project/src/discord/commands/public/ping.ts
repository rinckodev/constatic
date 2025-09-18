import { createCommand } from "#base";
import { createDate, createRow } from "@magicyan/discord";
import { ApplicationCommandType, ButtonBuilder, ButtonStyle } from "discord.js";

createCommand({
	name: "ping",
	description: "Replies with pong 🏓",
	type: ApplicationCommandType.ChatInput,
	async run(interaction){
		const now = createDate();
		const row = createRow(
			// ../../responders/buttons/remind.ts
			new ButtonBuilder({ 
				customId: `/remind/${now.toISOString()}`,
				style: ButtonStyle.Success,
				label: "Ping",
				emoji: "👋"
			})
		);
		await interaction.reply({
			flags: ["Ephemeral"], 
			content: `Pong 🏓`,
			components: [row],
		});
	}
});