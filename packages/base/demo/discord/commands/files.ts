import { ApplicationCommandOptionType } from "discord.js";
import { createCommand } from "../index.js";


createCommand({
    name: "files",
    description: "Files command demo",
    options: [
        {
            name: "image",
            type: ApplicationCommandOptionType.Attachment,
            fileTypes: ["image"],
            required: false,
        },
        {
            name: "audio",
            type: ApplicationCommandOptionType.Attachment,
            fileTypes: ["audio"],
            required: false,
        },
        {
            name: "video",
            type: ApplicationCommandOptionType.Attachment,
            fileTypes: ["video"],
            required: false,
        },
    ],
    async run(interaction){
        const { options } = interaction;
        const image = options.getAttachment("image"); 
        const audio = options.getAttachment("audio"); 
        const video = options.getAttachment("video");
        
        await interaction.reply({
            flags: ["Ephemeral"],
            content: "Ok"
        });

        console.log(image);
        console.log(audio);
        console.log(video);
    }
});