import group from "./group.js";

group.subcommand({
    name: "update",
    description: "update song command",
    async run(interaction){
        await interaction.reply({
            flags: "Ephemeral",
            content: "update song"
        })
    }
});