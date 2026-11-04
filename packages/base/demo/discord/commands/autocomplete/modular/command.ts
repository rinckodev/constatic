import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { createCommand } from "../../../index.js";

const command = createCommand({
    name: "modularautocomplete",
    description: "modular autocomplete command",
    type: ApplicationCommandType.ChatInput,
});

const group = command.group({
    name: "foo",
});

group.subcommand({
    name: "bar",
    options: [
        {
            name: "option",
            type: ApplicationCommandOptionType.String,
            required: true,
            async autocomplete({ options }){
                const query = options.getFocused();

                return Array.from({ length: 30 }).map((_, i) => ({
                    name: `bar: ${i} + ${query}`,
                    value: i.toString()
                }));
            }
        },
    ],
    async run(interaction){
        const { options } = interaction;

        console.log(options.getString("option"));

        await interaction.reply({
            flags: "Ephemeral",
            content: "Autocomplete bar"
        });
    }
});

command.subcommand({
    name: "baz",
    options: [
        {
            name: "option",
            type: ApplicationCommandOptionType.String,
            required: true,
            async autocomplete({ options }){
                const query = options.getFocused();

                return Array.from({ length: 30 }).map((_, i) => ({
                    name: `baz: ${i} + ${query}`,
                    value: i.toString()
                }));
            }
        },
    ],
    async run(interaction){
        const { options } = interaction;

        console.log(options.getString("option"));

        await interaction.reply({
            flags: "Ephemeral",
            content: "Autocomplete baz"
        });
    }
});