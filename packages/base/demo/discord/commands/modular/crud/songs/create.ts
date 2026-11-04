import group from "./group.js";

group.subcommand({
    name: "create",
    description: "create song command",
    async run(interaction){
        await interaction.reply({
            flags: "Ephemeral",
            content: "create song"
        })
    }
});