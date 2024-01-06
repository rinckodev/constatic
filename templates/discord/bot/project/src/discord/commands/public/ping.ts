import { Command } from "#base";
import { ApplicationCommandType } from "discord.js";

new Command({
    name: "ping",
    description: "Reply with pong",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    async run(interaction){
        interaction.reply({ ephemeral, content: "pong"})
    }
});