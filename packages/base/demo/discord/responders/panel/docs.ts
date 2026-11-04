import { ResponderType } from "#package";
import { createResponder } from "../../index.js";

createResponder({
    customId: "/demo/panel/doc{s}?/:id?",
    types: [ResponderType.Button], cache: "cached",
    async run(interaction, { id }) {
        await interaction.deferUpdate();

        console.log(interaction.customId, id);
    },
});