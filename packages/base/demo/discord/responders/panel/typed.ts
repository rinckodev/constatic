import { ResponderType } from "#package";
import { createResponder } from "../../index.js";

createResponder({
    customId: "/demo/panel/typed/:type(video|audio|image)",
    types: [ResponderType.Button], cache: "cached",
    async run(interaction, { type }) {

        await interaction.deferUpdate();
        
        console.log(interaction.customId);
        console.log("└ type:", type);
    },
});