import { ResponderType } from "#package";
import { createResponder } from "../../index.js";

createResponder({
    customId: "/demo/panel/basic/:style",
    types: [ResponderType.Button], cache: "cached",
    async run(interaction, { style }) {

        await interaction.deferUpdate();
        
        console.log(style);
    },
});

createResponder({
    customId: "/demo/panel/basic/:opt?",
    types: [ResponderType.Button], cache: "cached",
    async run(interaction, { opt }) {

        await interaction.deferUpdate();
        
        console.log("Optional >>", opt);
    },
});