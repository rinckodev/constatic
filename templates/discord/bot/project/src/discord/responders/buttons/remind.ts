import { createResponder, ResponderType } from "#base";
import { time } from "discord.js";
import { z } from "zod";

const schema = z.object({
    date: z.coerce.date(),
});
createResponder({
    customId: "remind/:date", 
    types: [ResponderType.Button], 
    parse: schema.parse, cache: "cached",
    async run(interaction, { date }) {
        await interaction.reply({ flags, 
            content: `You run ping command ${time(date, "R")}` 
        });
    },
});