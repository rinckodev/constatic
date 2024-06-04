import { replaceText, limitText, createEmbed, createEmbedAuthor, brBuilder } from "@magicyan/discord";
import { Client, codeBlock, WebhookClient } from "discord.js";
import settings from "../../settings.json" with { type: "json" };
import { consola as log } from "consola";
import chalk from "chalk";

export async function onError(error: any, client: Client<true>){
    log.log(client.user.displayName);
    log.error(error);

    const webhooksLogURL = process.env.WEBHOOK_LOGS_URL;
    if (!webhooksLogURL) return;
    const { user } = client;

    const errorMessage: string[] = [];
    
    if ("message" in error) errorMessage.push(String(error.message)); 
    if ("stack" in error) {
        const formated = replaceText(String(error.stack), { [__rootname]: "" });
        const limited = limitText(formated, 3500, "...");
        errorMessage.push(limited);
    }
    const embed = createEmbed({
        color: settings.colors.danger,
        author: createEmbedAuthor(user),
        description: codeBlock("ts", brBuilder(...errorMessage)),
    });

    const webhook = new WebhookClient({ url: webhooksLogURL });
    webhook.send({ embeds: [embed] }).catch(log.error);
}

process.on("SIGINT", () => {
    log.info(chalk.dim("👋 Bye"));
    process.exit(0);
});