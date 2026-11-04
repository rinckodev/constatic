import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { createCommand } from "../../index.js";

createCommand({
    name: "autocomplete",
    description: "autocomplete command",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "option1",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        },
        {
            name: "option2",
            type: ApplicationCommandOptionType.String,
            required: true,
            async autocomplete({ options }){
                const query = options.getFocused();

                return Array.from({ length: 25 }).map((_, i) => ({
                    name: `option2: ${i} + ${query}`,
                    value: i.toString()
                }));
            }
        },
    ],
    async autocomplete({ options }){
        const query = options.getFocused();

        return Array.from({ length: 25 }).map((_, i) => ({
            name: `${i} + ${query}`,
            value: i.toString()
        }));
    },
    async run(interaction) {
        const { options } = interaction;

        console.log(options.getString("option1"));
        console.log(options.getString("option2"));

        await interaction.reply({
            flags: "Ephemeral",
            content: "Autocomplete"
        });
    }
});