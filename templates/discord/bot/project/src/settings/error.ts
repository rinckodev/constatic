import { env } from "#settings";
import { brBuilder, createEmbed, createEmbedAuthor, createWebhookClient, limitText, replaceText } from "@magicyan/discord";
import ck from "chalk";
import { type Client, codeBlock } from "discord.js";
import settings from "../../settings.json" with { type: "json" };
import { logger } from "./logger.js";

export async function baseErrorHandler(error: any, client?: Client){
    if (client?.user) logger.log(client.user.displayName);

    const errorMessage: string[] = [];

    const hightlight = (text: string) => text
    .replace(/\(([^)]+)\)/g, (_, match) =>  ck.gray(`(${ck.cyan(match)})`));

    if ("message" in error) errorMessage.push(ck.red(`${error.message}`)); 
    if ("stack" in error) {
        const formated = replaceText(String(error.stack), { 
            [__rootname]: ".", 
            "at ": ck.gray("at ")
        });
        errorMessage.push(limitText(hightlight(formated), 3500, "..."));
    }
    
    logger.error(brBuilder(errorMessage));

    if (!env.WEBHOOK_LOGS_URL) return;
    
    const embed = createEmbed({
        color: settings.colors.danger,
        author: client?.user ? createEmbedAuthor(client.user) : undefined,
        description: codeBlock("ansi", brBuilder(errorMessage)),
    });

    const webhook = createWebhookClient(env.WEBHOOK_LOGS_URL);
    if (!webhook){
        logger.log();
        logger.error(`ENV VAR → ${ck.bold.underline("WEBHOOK_LOGS_URL")} Invalid webhook url`)
        logger.log();
        logger.warn("Unable to send logs to webhook because the url is invalid");
        return;
    }

    await webhook
    .send({ embeds: [embed] })
    .catch(logger.error);
}

function exit(){
    logger.log(ck.dim("..."));
    process.exit(0);
}

process.on("SIGINT", exit);
process.on("SIGTERM", exit);