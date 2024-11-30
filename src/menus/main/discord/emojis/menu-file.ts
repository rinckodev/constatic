import { APIEmoji, DiscordBotToken, ProgramMenuProps } from "#types";
import { input } from "@inquirer/prompts";
import { fetchDiscordEmojis } from "./fetch.js";
import fs from "node:fs/promises";
import log from "consola";
import { sleep } from "#helpers";
import { menus } from "#menus";

export async function discordEmojisFileMenu(props: ProgramMenuProps, token: DiscordBotToken){
    const emojis = await fetchDiscordEmojis(props, token);
    if (!emojis) return;

    const filepath = await input({
        message: "File path",
        default: "emojis.json",
        required: true,
        validate(value) {
            if (!value.endsWith(".json")){
                return "Não termina com .json";
            }
            return true;
        },
    });

    function toRecord(acc: Record<string, string>, emoji: APIEmoji){
        return { ...acc, [emoji.name]: emoji.id };
    }

    const data = {
        static: emojis.filter(e => !e.animated).reduce(toRecord, {}),
        animated: emojis.filter(e => e.animated).reduce(toRecord, {}),
    };

    try {
        const toJson = JSON.stringify(data, null, 2);
        await fs.writeFile(filepath, toJson, "utf-8");
        log.success("File writtend successfully!");
    } catch(error){
        log.error("An error occurred while trying to write the file!");
    }

    await sleep(1000);
    menus.discord.emojis.main(props, token);
}