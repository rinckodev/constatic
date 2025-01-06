import { createCommand, createResponder, ResponderType } from "#base";
import { createEmbed, createEmbedAuthor, createRow } from "@magicyan/discord";
import { ApplicationCommandType, ButtonBuilder, ButtonStyle, InteractionReplyOptions, User } from "discord.js";

createCommand({
    name: "counter",
    description: "Counter command 🔢",
    type: ApplicationCommandType.ChatInput,
    run(interaction) {
        interaction.reply(counterMenu(interaction.user, 0));
    }
});

createResponder({
    customId: "counter/:current",
    types: [ResponderType.Button], cache: "cached",
    parse: params => ({ 
        current: Number.parseInt(params.current) 
    }),
    async run(interaction, { current }) {
        await interaction.update(
            counterMenu(interaction.user, current)
        );
    },
});

function counterMenu<R>(user: User, current: number): R {    
    const embed = createEmbed({
        author: createEmbedAuthor(user),
        color: "Random",
        description: `Current value: ${current}`
    });
    const components = [
        createRow(
            new ButtonBuilder({
                customId: `counter/${current+1}`, 
                label: "+", style: ButtonStyle.Success
            }),
            new ButtonBuilder({
                customId: `counter/${current-1}`, 
                label: "-", style: ButtonStyle.Danger
            }),
        )
    ];

    return ({
        flags, embeds: [embed], components
    } satisfies InteractionReplyOptions) as R;
}