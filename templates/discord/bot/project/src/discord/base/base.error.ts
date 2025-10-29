import { env } from "#env";
import { brBuilder, createComponents, createDate, createWebhookClient, limitText, replaceText, spaceBuilder } from "@magicyan/discord";
import ck from "chalk";
import { type Client, codeBlock, time } from "discord.js";

export async function baseErrorHandler(error: any, client?: Client){
    if (client?.user) console.log(client.user.displayName);

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
    
    console.error(brBuilder(text));

    if (!env.WEBHOOK_LOGS_URL) return;

    const webhook = createWebhookClient(env.WEBHOOK_LOGS_URL);
    if (!webhook){
        console.log();
        console.error(`ENV VAR → ${ck.bold.underline("WEBHOOK_LOGS_URL")} Invalid webhook url`)
        console.log();
        console.warn("Unable to send logs to webhook because the url is invalid");
        return;
    }

    await webhook
        .send({
            flags: ["IsComponentsV2"],
            components: createComponents([
                codeBlock("ansi", brBuilder(text)),
                time(createDate(), "R")
            ]),
            withComponents: true,
            avatarURL: client?.user?.displayAvatarURL({ size: 512 }),
            username: spaceBuilder(client?.user?.username, "Logs")
        })
        .catch(console.error);
}

function exit(){
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    console.log(ck.dim("..."));
    process.exit(0);
}

process.on("SIGINT", exit);
process.on("SIGTERM", exit);