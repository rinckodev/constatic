import { replaceText, limitText, createEmbed, createEmbedAuthor, brBuilder } from "@magicyan/discord";
import { Client, codeBlock, WebhookClient } from "discord.js";
import settingsJson from "../../settings.json" with { type: "json" };
import { consola as log } from "consola";
import chalk from "chalk";

export async function onError(error: Error | any, client: Client<true>){
    log.error(error);

    const webhooksLogURL = process.env.WEBHOOK_LOGS_URL;
    if (!webhooksLogURL) return;

    const { user } = client;
    const errorMessage: string[] = [];
    
    if ("message" in error) errorMessage.push(String(error.message)); 
    if ("stack" in error) {
        const formated = replaceText(String(error.stack), { [__rootname]: "" });
        const limited = limitText(formated, 2800, "...");
        errorMessage.push(limited);
    }
    
    const embed = createEmbed({
        color: settingsJson.colors.danger,
        author: createEmbedAuthor(user),
        description: codeBlock("ts", brBuilder(...errorMessage)),
    });

    const webhook = new WebhookClient({ url: webhooksLogURL });

    webhook.send({ embeds: [embed] }).catch(log.error);
}

process.on("SIGINT", () => {
    log.info(chalk.dim("👋 Exit"));
    process.exit(0);
});