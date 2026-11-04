import group from "./group.js";

group.subcommand({
    name: "delete",
    description: "delete song command",
    async run(interaction){
        await interaction.reply({
            flags: "Ephemeral",
            content: "delete song"
        })
    }
});