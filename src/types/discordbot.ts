interface DiscordBotTemplateDatabase {
    name: string,
    path: string;
    hint?: string;
    dependencies: Record<string, string>
    scripts?: Record<string, string>
}

export interface DiscordBotTemplateProperties {
    databases: DiscordBotTemplateDatabase[] 
}