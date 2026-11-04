import group from "./group.js";

group.subcommand({
    name: "update",
    description: "update book command",
    async run(interaction){
        await interaction.reply({
            flags: "Ephemeral",
            content: "update book"
        })
    }
});