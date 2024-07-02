import { replaceText, limitText, createEmbed, createEmbedAuthor, brBuilder } from "@magicyan/discord";
import { type Client, codeBlock, WebhookClient } from "discord.js";
import settings from "../../settings.json" with { type: "json" };
import { consola as log } from "consola";
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
export function registerIntentsErrorHandler(){
    function errorHandler(err: Error){
        if (!err.message.includes("intents")) return;
        log.error({
            type: "INTENTS",
            message: chalk.red(err.message)
        });
        log.fatal(chalk.red(brBuilder(
            "Go to the discord developer portal, access your application",
            "then in the \"bot\" tab, activate the necessary intents"
        )));
    }
    process.on("uncaughtException", errorHandler);
    return () => process.off("uncaughtException", errorHandler);
}

process.on("SIGINT", () => {
    log.info(chalk.dim("👋 Bye"));
    process.exit(0);
});