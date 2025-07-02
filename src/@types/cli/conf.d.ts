import type { DiscordBotToken, Language, ScriptPreset } from "#types";

export interface ConfSchema {
    "discord.bot.tokens": DiscordBotToken[]
    "lang": Language,
    "presets.scripts": ScriptPreset[]
}