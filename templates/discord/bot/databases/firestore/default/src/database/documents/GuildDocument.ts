type ChannelInfo = {
    id: string;
    url: string;
}

interface GuildDocument {
    channels?: {
        logs?: ChannelInfo
    }
}

export { GuildDocument };