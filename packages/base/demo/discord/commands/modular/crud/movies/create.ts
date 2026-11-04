import group from "./group.js";

group.subcommand({
    name: "create",
    description: "create movie command",
    async run(interaction){
        await interaction.reply({
            flags: "Ephemeral",
            content: "create movie"
        })
    }
});