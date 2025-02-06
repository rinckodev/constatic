import { DiscordBotToken, Language } from "#types";

export interface ConfSchema {
    "discord.bot.tokens": DiscordBotToken[]
    "lang": Language,
}