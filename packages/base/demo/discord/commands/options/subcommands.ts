import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { createCommand } from "../../index.js";

createCommand({
    name: "subcommands",
    description: "subcommands command",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "first",
            description: "first sub command option",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "second",
            description: "second sub command option",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "third",
            description: "third sub command option",
            type: ApplicationCommandOptionType.Subcommand,
        },
    ],
    async run(interaction) {
        const { options } = interaction;

        console.log(options.getSubcommand())

        await interaction.reply({
            flags: "Ephemeral",
            content: "groups"
        });
    }
});