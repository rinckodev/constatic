import { Command, Responder, ResponderType } from "#base";
import { createEmbed, createEmbedAuthor, createRow } from "@magicyan/discord";
import { ApplicationCommandType, ButtonBuilder, ButtonStyle, User } from "discord.js";

new Command({
    name: "counter",
    description: "Counter command",
    type: ApplicationCommandType.ChatInput,
    run(interaction) {
        interaction.reply(counterMenu(interaction.user, 0));
    },
});

new Responder({
    customId: "counter/:action/:current",
    type: ResponderType.Button, cache: "cached",
    run(interaction, params) {
        const current = Number.parseInt(params.current);
        const updated = params.action === "add" ? current + 1 : current - 1;

        interaction.update(counterMenu(interaction.user, updated));
    },
});

function counterMenu(user: User, current: number){    
    const embed = createEmbed({
        author: createEmbedAuthor(user),
        color: "Random",
        description: `Current value: ${current}`
    });
    const row = createRow(
        new ButtonBuilder({
            customId: `counter/add/${current}`, 
            label: "+", 
            style: ButtonStyle.Success
        }),
        new ButtonBuilder({
            customId: `counter/remove/${current}`, 
            label: "-", 
            style: ButtonStyle.Danger
        }),
    );
    return { ephemeral, embeds: [embed], components: [row] };
}