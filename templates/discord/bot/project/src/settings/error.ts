import { replaceText, limitText, createEmbed, createEmbedAuthor, brBuilder } from "@magicyan/discord";
import { type Client, codeBlock, WebhookClient } from "discord.js";
import settings from "../../settings.json" with { type: "json" };
import log from "consola";
import chalk from "chalk";

export async function onError(error: any, client: Client<true>){
    log.log(client.user.displayName);
    log.error(error);

    if (!process.env.WEBHOOK_LOGS_URL) return;

    const errorMessage: string[] = [];
    
    if ("message" in error) errorMessage.push(String(error.message)); 
    if ("stack" in error) {
        const formated = replaceText(String(error.stack), { [__rootname]: "" });
        errorMessage.push(limitText(formated, 3500, "..."));
    }
    const embed = createEmbed({
        color: settings.colors.danger,
        author: createEmbedAuthor(client.user),
        description: codeBlock("ts", brBuilder(errorMessage)),
    });

    new WebhookClient({ url: process.env.WEBHOOK_LOGS_URL })
    .send({ embeds: [embed] }).catch(log.error);
}

process.on("SIGINT", () => {
    log.info(chalk.dim("👋 Bye"));
    process.exit(0);
});