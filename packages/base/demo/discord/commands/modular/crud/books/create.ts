import group from "./group.js";

group.subcommand({
    name: "create",
    description: "create book command",
    async run(interaction){
        await interaction.reply({
            flags: "Ephemeral",
            content: "create book"
        })
    }
});