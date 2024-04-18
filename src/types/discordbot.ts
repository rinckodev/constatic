declare global {
    interface DiscordBotTemplateDatabase {
        name: string,
        path: string;
        hint?: string;
        dependencies: Record<string, string>
        scripts?: Record<string, string>
    }
    interface DiscordBotTemplateProperties {
        databases: DiscordBotTemplateDatabase[] 
    }
    interface DiscordBotToken {
        name: string;
        token: string;
        invite: string;
        id: string;
    }
}