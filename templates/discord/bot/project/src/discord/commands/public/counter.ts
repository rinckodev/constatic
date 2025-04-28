import { createCommand, createResponder, ResponderType } from "#base";
import { settings } from "#settings";
import { createContainer, createSection } from "@magicyan/discord";
import { ApplicationCommandType, ButtonBuilder, ButtonStyle, InteractionReplyOptions } from "discord.js";

createCommand({
    name: "counter",
    description: "Counter command 🔢",
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        await interaction.reply(counterMenu(0));
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
            counterMenu(current)
        );
    },
});

function counterMenu<R>(current: number): R {
    const container = createContainer({
        accentColor: settings.colors.azoxo,
        components: [
            createSection({
                content: `## Current value: \` ${current} \``,
                button: new ButtonBuilder({
                    customId: `counter/00`, 
                    label: "Reset", style: ButtonStyle.Secondary
                }),
            }),
            createSection({
                content: `-# Increment value`,
                button: new ButtonBuilder({
                    customId: `counter/${current+1}`, 
                    label: "+", style: ButtonStyle.Success
                }),
            }),
            createSection({
                content: `-# Decrement value`,
                button: new ButtonBuilder({
                    customId: `counter/${current-1}`, 
                    label: "-", style: ButtonStyle.Danger
                }),
            }),
        ]
    });

    return ({
        flags: ["Ephemeral", "IsComponentsV2"],
        components: [container]
    } satisfies InteractionReplyOptions) as R;
}