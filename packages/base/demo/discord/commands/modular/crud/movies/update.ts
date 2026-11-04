import group from "./group.js";

group.subcommand({
    name: "update",
    description: "update movie command",
    async run(interaction){
        await interaction.reply({
            flags: "Ephemeral",
            content: "update movie"
        })
    }
});