import { createResponder } from "#base";
import { ResponderType } from "@constatic/base";
import { createDate } from "@magicyan/discord";
import { time } from "discord.js";
import { z } from "zod";

const schema = z.object({
    date: z.transform(createDate),
});
createResponder({
    customId: "remind/:date",
    types: [ResponderType.Button],
    parse: schema.parse, cache: "cached",
    async run(interaction, { date }) {
        await interaction.reply({
            flags: ["Ephemeral"],
            content: `⏳ You run ping command ${time(date, "R")}`,
        });
    },
});