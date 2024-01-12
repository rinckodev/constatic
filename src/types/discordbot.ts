interface DiscordBotTemplateDatabase {
    name: string,
    paths: {
        default: string;
        [x: string]: string;
    }
    variants?: string[],
    dependencies: Record<string, string>
    scripts?: Record<string, string>
}

export interface DiscordBotTemplateProperties {
    databases: DiscordBotTemplateDatabase[] 
}