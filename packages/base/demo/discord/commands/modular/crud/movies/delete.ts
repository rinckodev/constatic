import group from "./group.js";

group.subcommand({
    name: "delete",
    description: "delete movie command",
    async run(interaction){
        await interaction.reply({
            flags: "Ephemeral",
            content: "delete movie"
        })
    }
});