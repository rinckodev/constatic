import { Command, Responder, ResponderType } from "#base";
import { createEmbed, createEmbedAuthor, createRow } from "@magicyan/discord";
import { ApplicationCommandType, ButtonBuilder, ButtonStyle, User } from "discord.js";

new Command({
    name: "counter",
    description: "Counter command 🔢",
    type: ApplicationCommandType.ChatInput,
    run(interaction) {
        interaction.reply(counterMenu(interaction.user, 0));
    },
});

new Responder({
    customId: "counter/:current",
    type: ResponderType.Button, cache: "cached",
    run(interaction, { current }) {
        const parsed = Number.parseInt(current);
        interaction.update(counterMenu(interaction.user, parsed));
    },
});

function counterMenu(user: User, current: number) {    
    const embed = createEmbed({
        author: createEmbedAuthor(user),
        color: "Random",
        description: `Current value: ${current}`
    });
    const row = createRow(
        new ButtonBuilder({
            customId: `counter/${current+1}`, 
            label: "+", style: ButtonStyle.Success
        }),
        new ButtonBuilder({
            customId: `counter/${current-1}`, 
            label: "-", style: ButtonStyle.Danger
        }),
    );
    return { ephemeral, embeds: [embed], components: [row] };
}