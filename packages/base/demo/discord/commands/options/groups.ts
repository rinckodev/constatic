import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { createCommand } from "../../index.js";

createCommand({
    name: "groups",
    description: "groups command",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "a",
            description: "a group",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "a1",
                    description: "a1 subcommand group",
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "a2",
                    description: "a2 subcommand group",
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "a3",
                    description: "a3 subcommand group",
                    type: ApplicationCommandOptionType.Subcommand,
                },
            ]
        },
        {
            name: "b",
            description: "b group",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "b1",
                    description: "b1 subcommand group",
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "b2",
                    description: "b2 subcommand group",
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "b3",
                    description: "b3 subcommand group",
                    type: ApplicationCommandOptionType.Subcommand,
                },
            ]
        },
        {
            name: "c",
            description: "c group",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "c1",
                    description: "c1 subcommand group",
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "c2",
                    description: "c2 subcommand group",
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "c3",
                    description: "c3 subcommand group",
                    type: ApplicationCommandOptionType.Subcommand,
                },
            ]
        },
    ],
    async run(interaction) {
        const { options } = interaction;

        console.log(options.getSubcommandGroup())
        console.log(options.getSubcommand())

        await interaction.reply({
            flags: "Ephemeral",
            content: "subcommands"
        });
        
    }
});