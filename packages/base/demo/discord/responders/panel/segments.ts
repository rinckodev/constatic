import { ResponderType } from "#package";
import { createResponder } from "../../index.js";

// const pattern = "/demo/panel/pattern/:path+",
// const pattern = "/demo/panel/pattern/:path?",
// const pattern = "/demo/panel/pattern/:path*";
const pattern = "/demo/panel/pattern/:path?/*";

createResponder({
    customId: pattern,
    types: [ResponderType.Button], cache: "cached",
    async run(interaction, { path }) {

        await interaction.deferUpdate();
        
        console.log(interaction.customId);
        console.log("└ path:", path);
    },
});