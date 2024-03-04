import { Delete, MetaTypeCreator } from "firelord";

type ChannelInfo = { id: string, url: string };

type GuildChannels = "logs" | "global" | "general"

export type GuildDocument = MetaTypeCreator<
    {
        channels: Record<GuildChannels | string&{}, ChannelInfo> | Delete
    },
    "guilds", string
>

