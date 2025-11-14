import { Client, codeBlock, TextDisplayBuilder, time, WebhookClient } from "discord.js";
import console from "node:console";
import { styleText } from "node:util";

export class ConstaticError extends Error {
    constructor(
        message: string
    ) {
        super(message);
    }
}

export class RunBlockError {}

export async function baseErrorHandler(error: any, client?: Client) {
    if (client?.user) console.log(client.user.displayName);

    const text: string[] = [];

    const hightlight = (text: string) => text
        .replace(/\(([^)]+)\)/g, (_, match) => [
            styleText("gray", "("),
            styleText("cyan", match),
            styleText("gray", ")"),
        ].join(""));


    if ("message" in error) text.push(styleText("red", `${error.message}`));
    if ("stack" in error) {
        const formated = `${error.stack}`
            .replaceAll(process.cwd(), ".")
            .replaceAll("at ", styleText("gray", "at "));

        text.push(hightlight(formated));
    }

    console.log(text.join("\n"));

    const url = process.env.WEBHOOK_LOGS_URL;
    if (!url) return;

    try {
        const webhook = new WebhookClient({ url });
        const username = client?.user?.username;
        await webhook
            .send({
                flags: ["IsComponentsV2"],
                components: [
                    new TextDisplayBuilder({
                        content: [
                            codeBlock("ansi", text.join("\n")),
                            time(new Date(), "R")
                        ].join("\n")
                    })
                ],
                withComponents: true,
                avatarURL: client?.user?.displayAvatarURL({ size: 512 }),
                username: username ? `${username} logs` : "Logs"
            })
            .catch(console.error);
    } catch {
        console.log();
        console.error(
            "ENV VAR → %s Invalid webhook url",
            styleText(["bold", "underline"], "WEBHOOK_LOGS_URL")
        )
        console.log();
        console.warn("Unable to send logs to webhook because the url is invalid");
    }
}