import type { BotAPIServerPreset, BotDatabasePreset } from "./preset.js";

export interface BotTemplateProperties {
    presets: {
        databases: Record<string, BotDatabasePreset>;
        servers: Record<string, BotAPIServerPreset>
    }
}