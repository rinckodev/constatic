import { ApplicationCommandType } from "discord.js";
import { menus } from "../../menus/index.js";
import { createCommand } from "../index.js";

createCommand({
    name: "panel",
    description: "Demo panel command",
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        await interaction.reply(menus.panel());
    }
});