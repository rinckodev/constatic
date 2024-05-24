import { Responder, ResponderType } from "#base";
import { time } from "discord.js";

new Responder({
    customId: "remind/:date",
    type: ResponderType.Button,
    run(interaction, params) {
        const date = new Date(params.date);
        interaction.reply({ ephemeral, content: `You run ping command ${time(date, "R")}` });
    },
});