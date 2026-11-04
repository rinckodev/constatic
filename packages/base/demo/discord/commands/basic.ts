import { createCommand } from "../index.js";

createCommand({
    name: "basic",
    description: "Basic command demo",
    async run(interaction){
        await interaction.reply({
            flags: "Ephemeral",
            content: "Hello world"
        });
    }
});