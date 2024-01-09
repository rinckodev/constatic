interface DiscordBotTemplateDatabase {
    name: string,
    paths: {
        default: string;
        prisma?: string;
    }
    dependencies: Record<string, string>
    scripts?: Record<string, string>
}

export interface DiscordBotTemplateProperties {
    databases: DiscordBotTemplateDatabase[] 
}