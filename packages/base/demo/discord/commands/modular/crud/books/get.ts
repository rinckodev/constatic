import group from "./group.js";

group.subcommand({
    name: "get",
    description: "get book command",
    async run(interaction){
        await interaction.reply({
            flags: "Ephemeral",
            content: "get book"
        })
    }
});