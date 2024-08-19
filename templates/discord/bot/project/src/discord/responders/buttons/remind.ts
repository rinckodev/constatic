import { Responder, ResponderType } from "#base";
import { time } from "discord.js";
import { z } from "zod";

const schema = z.object({
    date: z.coerce.date(),
});
new Responder({
    customId: "remind/:date",
    type: ResponderType.Button,
    parse: params => schema.parse(params),
    run(interaction, { date }) {
        interaction.reply({ ephemeral, content: `You run ping command ${time(date, "R")}` });
    },
});