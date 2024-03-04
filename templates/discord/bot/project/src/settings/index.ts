import { brBuilder, createEmbed, createEmbedAuthor, limitText, replaceText } from "@magicyan/discord";
import { consola } from "consola";
import { Client, WebhookClient, codeBlock } from "discord.js";
import "./global.js";
import settingsJson from "./settings.json" with { type: "json" };

export const log = consola;
export const settings = settingsJson;

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
        author: createEmbedAuthor({ user }),
        description: codeBlock("ts", brBuilder(...errorMessage)),
    });

    const webhook = new WebhookClient({ url: webhooksLogURL });

    webhook.send({ embeds: [embed] })
    .catch(log.error);
}

