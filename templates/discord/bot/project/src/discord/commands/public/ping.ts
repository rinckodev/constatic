import { Command } from "#base";
import { createRow } from "@magicyan/discord";
import { ApplicationCommandType, ButtonBuilder, ButtonStyle } from "discord.js";

new Command({
	name: "ping",
	description: "Replies with pong 🏓",
	type: ApplicationCommandType.ChatInput,
	run(interaction){
		const row = createRow(
			// ../../components/buttons/remind.ts
			new ButtonBuilder({ 
				customId: `remind/${new Date().toISOString()}`,
				label: "Ping",
				style: ButtonStyle.Success
			})
		);

		interaction.reply({ fetchReply, ephemeral, content: "pong", components: [row] });
	}
});