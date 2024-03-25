import { Component } from "#base";
import { ComponentType, time } from "discord.js";

// ../../commands/public/ping.ts
new Component({
    customId: "remind/:date",
    type: ComponentType.Button, cache: "cached",
    async run(interaction, params) {

        const date = new Date(params.date);
        interaction.reply({ ephemeral, content: `You run ping command ${time(date, "R")}` });
    },
});