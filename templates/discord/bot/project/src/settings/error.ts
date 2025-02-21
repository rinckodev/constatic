import { replaceText, limitText, createEmbed, createEmbedAuthor, brBuilder } from "@magicyan/discord";
import { type Client, codeBlock, WebhookClient } from "discord.js";
import settings from "../../settings.json" with { type: "json" };
import ck from "chalk";
import { logger } from "./logger.js";

export async function baseErrorHandler(error: any, client: Client<true>){
    logger.log(client.user.displayName);

    const errorMessage: string[] = [];

    const hightlight = (text: string) => text
    .replace(/\(([^)]+)\)/g, (_, match) => `[${ck.cyan(match)}]`);

    if ("message" in error) errorMessage.push(ck.red(`${error.message}`)); 
    if ("stack" in error) {
        const formated = replaceText(String(error.stack), { 
            [__rootname]: ".", 
            at: ck.gray("at")
        });
        errorMessage.push(limitText(hightlight(formated), 3500, "..."));
    }
    
    logger.error(brBuilder(errorMessage));

    if (!process.env.WEBHOOK_LOGS_URL) return;
    
    const embed = createEmbed({
        color: settings.colors.danger,
        author: createEmbedAuthor(client.user),
        description: codeBlock("ansi", brBuilder(errorMessage)),
    });

    new WebhookClient({ url: process.env.WEBHOOK_LOGS_URL })
    .send({ embeds: [embed] })
    .catch(logger.error);
}

process.on("SIGINT", () => {
    logger.log(ck.dim("..."));
    process.exit(0);
});