type ChannelInfo = { id: string, url: string };

export interface GuildData {
    channels?: {
        logs?: ChannelInfo
    }
}