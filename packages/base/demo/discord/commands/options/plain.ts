import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { createCommand } from "../../index.js";

createCommand({
    name: "plain",
    description: "plain options command",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "string",
            description: "string option",
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: "number",
            description: "number option",
            type: ApplicationCommandOptionType.Number,
            required: false,
        },
        {
            name: "integer",
            description: "integer option",
            type: ApplicationCommandOptionType.Integer,
            required: false,
        },
        {
            name: "boolean",
            description: "boolean option",
            type: ApplicationCommandOptionType.Boolean,
            required: false,
        },
        {
            name: "mentionable",
            description: "mentionable option",
            type: ApplicationCommandOptionType.Mentionable,
            required: false,
        },
        {
            name: "channel",
            description: "channel option",
            type: ApplicationCommandOptionType.Channel,
            required: false,
        },
        {
            name: "role",
            description: "role option",
            type: ApplicationCommandOptionType.Role,
            required: false,
        },
        {
            name: "user",
            description: "user option",
            type: ApplicationCommandOptionType.User,
            required: false,
        },
        {
            name: "attachment",
            description: "attachment option",
            type: ApplicationCommandOptionType.Attachment,
            required: false,
        },
    ],
    async run(interaction) {
        const { options } = interaction;

        console.log("string", options.getString("string"));
        console.log("number", options.getNumber("number"));
        console.log("integer", options.getInteger("integer"));
        console.log("boolean", options.getBoolean("boolean"));
        console.log("mentionable", options.getMentionable("mentionable"));
        console.log("channel", options.getChannel("channel"));
        console.log("role", options.getRole("role"));
        console.log("user", options.getUser("user"));

        await interaction.reply({
            flags: "Ephemeral",
            content: "plain"
        });
    }
});