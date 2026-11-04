import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { createCommand } from "../index.js";

createCommand({
    name: "mega",
    description: "mega command",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "car",
            description: "car commands",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "drive",
                    description: "drive car command",
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "stop",
                    description: "stop car command",
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "fix",
                    description: "fix car command",
                    type: ApplicationCommandOptionType.Subcommand,
                },
            ]
        },
        {
            name: "plants",
            description: "plants commands",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "crop",
                    description: "crop plants command",
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "sell",
                    description: "sell plants command",
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "delete",
                    description: "delete plants command",
                    type: ApplicationCommandOptionType.Subcommand,
                },
            ]
        },
        {
            name: "ores",
            description: "ores commands",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "mine",
                    description: "mine ores command",
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "smelt",
                    description: "smelt ores command",
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "sell",
                    description: "sell ores command",
                    type: ApplicationCommandOptionType.Subcommand,
                },
            ]
        },
    ],
    async run(interaction) {
        const { options } = interaction;

        await interaction.reply({
            flags: "Ephemeral",
            content: `${options.getSubcommandGroup()} / ${options.getSubcommand()}`
        });
    }
});