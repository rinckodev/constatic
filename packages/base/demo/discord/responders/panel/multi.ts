import { ResponderType } from "#package";
import { createResponder } from "../../index.js";

createResponder({
    customId: "/demo/panel/multi/:foo/static/:bar",
    types: [ResponderType.Button], cache: "cached",
    async run(interaction, params) {

        await interaction.deferUpdate();
        
        console.log("Multi >>", params);
    },
});

createResponder({
    customId: "/demo/panel/multi/:foo/:dynamic/:bar",
    types: [ResponderType.Button], cache: "cached",
    async run(interaction, params) {

        await interaction.deferUpdate();
        
        console.log("Multi dynamic >>", params);
    },
});