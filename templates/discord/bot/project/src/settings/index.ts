import { brBuilder, createEmbed, createEmbedAuthor, limitText, replaceText } from "@magicyan/discord";
import { consola as log } from "consola";
import { Client, WebhookClient, codeBlock } from "discord.js";
import "./global.js";
import settings from "./settings.json" with { type: "json" };

async function onError(error: Error | any, client: Client<true>){
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
        color: settings.colors.danger,
        author: createEmbedAuthor({ user }),
        description: codeBlock("ts", brBuilder(...errorMessage)),
    });

    const webhook = new WebhookClient({ url: webhooksLogURL });

    webhook.send({ embeds: [embed] })
    .catch(log.error);
}
export { log, onError, settings };

