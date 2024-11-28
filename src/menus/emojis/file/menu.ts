import { fileExists, getDiscordEmojis } from "#helpers";
import { menus } from "#menus";
import { APIEmoji, BotToken, ProgramMenuProps } from "#types";
import { spinner } from "@clack/prompts";
import fs from "node:fs/promises";
import { setTimeout } from "node:timers/promises";
import { filepathPrompt } from "./actions/dirname.js";

export async function discordEmojisFileMenu(props: ProgramMenuProps, token: BotToken){
    const loading = spinner();
    loading.start("Wait");

    const existingEmojis = await getDiscordEmojis(token)
    if (!existingEmojis.success){
        loading.stop("Unable to get application emojis", 1);
        await setTimeout(400);
        menus.emojis.main(props, token);
        return;
    }
    const amount = existingEmojis.data.length;
    if (!amount){
        loading.stop("No emoji found", 1);
        await setTimeout(400);
        menus.emojis.main(props, token);
        return;
    }

    function toRecord(acc: Record<string, string>, emoji: APIEmoji){
        return { ...acc, [emoji.name]: emoji.id };
    }
    
    const emojis = {
        static: existingEmojis.data.filter(e => !e.animated).reduce(toRecord, {}),
        animated: existingEmojis.data.filter(e => e.animated).reduce(toRecord, {}),
    };

    loading.stop();

    const filePath = await filepathPrompt(props.cwd);

    loading.start("Writing file! Wait");

    const done = async () => {
        loading.stop("File written successfully!");
        await setTimeout(400);
        menus.emojis.main(props, token);  
    }

    try {
        if (await fileExists(filePath)){
            const rawExistingFile = await fs.readFile(filePath, "utf-8");
            const existingFile = JSON.parse(rawExistingFile);
            Object.assign(existingFile, emojis);
            await fs.writeFile(filePath, JSON.stringify(existingFile, null, 2), "utf-8")  
            done();
            return;
        }
        await fs.writeFile(filePath, JSON.stringify(emojis, null, 2), "utf-8");
        done();
    } catch {
        loading.stop("An error occurred while trying to write the file!", 1);
        await setTimeout(400);
        menus.emojis.main(props, token);
    }
}