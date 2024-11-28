import { getDiscordEmojis, getFileInfo } from "#helpers";
import { BotToken, ProgramMenuProps } from "#types";
import { log, spinner } from "@clack/prompts";
import { setTimeout } from "node:timers/promises";
import { getEmojiPaths } from "./actions/getPaths.js";
import { dirnamePrompt } from "./prompts/dirname.js";
import { confirmPrompt } from "./prompts/confirm.js";
import { uploadImages } from "./actions/upload.js";
import { overwriteMethod } from "./prompts/methods.js";
import { menus } from "#menus";

export async function discordEmojisUploadMenu(props: ProgramMenuProps, token: BotToken){
    const directory = await dirnamePrompt(props.cwd);

    const processing = spinner();
    processing.start("🔍 Searching for files in nested folders");
    await setTimeout(500);
    
    const paths = await getEmojiPaths(directory);
    
    processing.message("🗃️ Getting information from found files");
    await setTimeout(500);
    
    const rawinfo = await getFileInfo(paths);
    
    processing.message("💾 Filtering files by size in KBs");
    await setTimeout(500);

    const files = rawinfo.filter(file => file.size < 256);

    if (!files.length){
        processing.stop("No images found in the given directory", 1);
        await setTimeout(400);
        menus.emojis.main(props, token);
        return;
    }
    
    processing.stop(`Image files available for upload: ${files.length}`);

    const existingEmojis = await getDiscordEmojis(token);
    if (!existingEmojis.success){
        log.error("An error occurred while trying to compare with existing emojis");
        return;
    }

    const procced = await confirmPrompt();

    if (!procced){
        menus.emojis.main(props, token);
        return;
    }

    const overwrite = await overwriteMethod();

    await uploadImages({
        files, token, overwrite, emojis: existingEmojis.data,
    });

    log.success("Upload process completed!")
    await setTimeout(400);
    menus.emojis.main(props, token);

}