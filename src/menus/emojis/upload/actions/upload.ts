import { createDiscordEmoji, deleteDiscordEmoji, handlePrompt } from "#helpers";
import { APIEmoji, BotToken, EmojiFileInfo } from "#types";
import { confirm, spinner } from "@clack/prompts";
import ck from "chalk";
import { setTimeout } from "node:timers/promises";

const uploading = spinner();

type OverwriteMethod = "all" | "ask" | "skip";

interface UploadImagesProps {
    emojis: APIEmoji[]
    files: EmojiFileInfo[], 
    token: BotToken, 
    overwrite: OverwriteMethod
}
export async function uploadImages({ emojis, files, overwrite, token }: UploadImagesProps){
    for(const file of files){
        uploading.start(`Uploading emoji ${ck.yellow(file.extension.slice(1))} ${ck.green.underline(file.name)}`);
        
        const existing = emojis.find(emoji => emoji.name === file.name);
        if (existing){
            const procced = await overwriteMethod({ overwrite, existing, token });
            if (!procced) continue
        }
        await setTimeout(150);
        const result = await createDiscordEmoji(token, { image: file.base64, name: file.name });
        if (!result.success){
            uploading.stop(result.error, 1);
            continue;
        }
        const action = existing ? "overwrited" : "created";
        uploading.stop(ck.green(`Success! ${ck.yellow.underline(file.name)} emoji ${ck.bgGreen(` ${action} `)}`));
    }
}

interface OverwriteMethodProps {
    overwrite: OverwriteMethod,
    token: BotToken,
    existing: APIEmoji
}

async function overwriteMethod({ overwrite, token, existing }: OverwriteMethodProps){
    switch(overwrite){
        case "all":{
            await deleteDiscordEmoji(token, existing.id);
            return true;
        }
        case "ask":{
            uploading.stop(ck.red(`An emoji named ${ck.yellow.underline(existing.name)} already exists!`), 1);
            const confirmDeletion = await handlePrompt(confirm({
                message: `Do you want to overwrite the emoji ${existing.name}?`,
            }));
            if (confirmDeletion){
                uploading.start(`Wait`);
                await deleteDiscordEmoji(token, existing.id);
            }
            return confirmDeletion;
        }
        case "skip":{
            uploading.stop(ck.yellow(`Existing emoji: ${existing.name} - Skipped`));
            return false;
        }
    }
}