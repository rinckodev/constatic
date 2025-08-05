import { env } from "#env";
import { brBuilder, createEmbed, createEmbedAuthor, createWebhookClient, limitText, replaceText } from "@magicyan/discord";
import ck from "chalk";
import { type Client, codeBlock } from "discord.js";
import { logger } from "./base.logger.js";

export async function baseErrorHandler(error: any, client?: Client){
    if (client?.user) logger.log(client.user.displayName);

    const text: string[] = [];

    const hightlight = (text: string) => text
    .replace(/\(([^)]+)\)/g, (_, match) =>  ck.gray(`(${ck.cyan(match)})`));

    if ("message" in error) text.push(ck.red(`${error.message}`)); 
    if ("stack" in error) {
        const formated = replaceText(String(error.stack), { 
            [process.cwd()]: ".", 
            "at ": ck.gray("at ")
        });
        text.push(limitText(hightlight(formated), 2800, "..."));
    }
    
    logger.error(brBuilder(text));

    if (!env.WEBHOOK_LOGS_URL) return;
    
    const embed = createEmbed({
        color: constants.colors.azoxo,
        author: client?.user ? createEmbedAuthor(client.user) : undefined,
        description: codeBlock("ansi", brBuilder(text)),
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
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    logger.log(ck.dim("..."));
    process.exit(0);
}

process.on("SIGINT", exit);
process.on("SIGTERM", exit);