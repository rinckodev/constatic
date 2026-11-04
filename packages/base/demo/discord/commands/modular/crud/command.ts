import { ApplicationCommandType } from "discord.js";
import { createCommand } from "../../../index.js";

export default createCommand({
    name: "crud",
    description: "crud commands",
    type: ApplicationCommandType.ChatInput,
});