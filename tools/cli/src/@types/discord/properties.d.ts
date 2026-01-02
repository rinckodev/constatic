import type { BotDatabasePreset, BotServerPreset } from "./preset.js";

export interface BotTemplateProperties {
    presets: {
        databases: Record<string, BotDatabasePreset>;
        servers: Record<string, BotServerPreset>
    }
}