interface DiscordBotTemplateDatabase {
    name: string,
    path: string;
    dependencies: Record<string, string>
    scripts?: Record<string, string>
}

export interface DiscordBotTemplateProperties {
    databases: DiscordBotTemplateDatabase[] 
}