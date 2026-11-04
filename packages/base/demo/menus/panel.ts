import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, type InteractionReplyOptions } from "discord.js";

export function demoPanelMenu<R>(): R {
    const customId = (ctx: string) => `/demo/panel/${ctx}`;
    
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder({
            customId: customId("basic/primary"),
            label: "Primary",
            style: ButtonStyle.Primary,
        }),
        new ButtonBuilder({
            customId: customId("basic/secondary"),
            label: "Secondary",
            style: ButtonStyle.Secondary,
        }),
        new ButtonBuilder({
            customId: customId("basic/success"),
            label: "Success",
            style: ButtonStyle.Success,
        }),
        new ButtonBuilder({
            customId: customId("basic/danger"),
            label: "Danger",
            style: ButtonStyle.Danger,
        }),
        new ButtonBuilder({
            customId: customId("basic"),
            label: "Opt",
            style: ButtonStyle.Secondary,
        }),
    );
    
    const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder({
            customId: customId("docs"),
            emoji: "🗃️",
            style: ButtonStyle.Primary,
        }),
        new ButtonBuilder({
            customId: customId("doc"),
            emoji: "📃",
            style: ButtonStyle.Secondary,
        }),
        new ButtonBuilder({
            customId: customId(`doc/${Date.now()}`),
            emoji: "🔎",
            style: ButtonStyle.Success,
        })
    );

    const row3 = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder({
            customId: customId("pattern/1"),
            label: "1 ...",
            style: ButtonStyle.Secondary,
        }),
        new ButtonBuilder({
            customId: customId("pattern/2/a"),
            label: "2 ...",
            style: ButtonStyle.Secondary,
        }),
        new ButtonBuilder({
            customId: customId("pattern/3/a/b/c"),
            label: "3 ...",
            style: ButtonStyle.Secondary,
        }),
        new ButtonBuilder({
            customId: customId("pattern"),
            label: "4 ...",
            style: ButtonStyle.Secondary,
        }),
    );
    const row4 = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder({
            customId: customId("typed/audio"),
            label: "Audio",
            style: ButtonStyle.Danger,
        }),
        new ButtonBuilder({
            customId: customId("typed/image"),
            label: "Image",
            style: ButtonStyle.Danger,
        }),
        new ButtonBuilder({
            customId: customId("typed/video"),
            label: "Video",
            style: ButtonStyle.Danger,
        }),
        new ButtonBuilder({
            customId: customId("typed/UNLISTED"),
            label: "unlisted",
            style: ButtonStyle.Danger,
        }),
    );

    const container = new ContainerBuilder()
        .addActionRowComponents(row)
        .addActionRowComponents(row2)
        .addActionRowComponents(row3)
        .addActionRowComponents(row4);

    return ({
        flags: ["Ephemeral", "IsComponentsV2"],
        components: [container]
    } satisfies InteractionReplyOptions) as R;
}