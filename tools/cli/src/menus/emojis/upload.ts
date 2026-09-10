import { actions } from "#actions";
import { menus } from "#menus";
import { api } from "#shared/api.js";
import { prompts } from "#shared/prompts.js";
import { ck } from "#utils/ck.js";
import { log } from "#utils/log.js";
import { createSpinner } from "#utils/spinner.js";
import { basename } from "node:path";
import { DiscordBotToken } from "../../shared/token.js";

export async function emojisUploadMenu(token: DiscordBotToken){
    const fetching = createSpinner()
        .start("Fetching application emojis");
    
    const emojisResult = await api.emojis.fetch(token.id, token.token);
    if (!emojisResult.success){
        fetching.fail(emojisResult.error);
        await menus.emojis.main();
        return;
    }
    fetching.stop();

    const emojis = emojisResult.data;

    const currentDir = ck.dim.underline(basename(process.cwd()) + "/");

    const dirpath = await prompts.input({
        message: `Provide the image directory path ${currentDir}`,
        // async validate(value){
        //     const exists = await program.fs.exists(resolve(value));
        //     if (!exists) throw new Error(
        //         `${value} is not a valid path`
        //     );
        // },
        default: "./"
    });
    
    const searching = createSpinner("🔍 Searching for files in nested folders...");

    const data = await actions.emojis.scan(dirpath);
    
    if (!data.length){
        searching.fail("No images found in the given directory!");
        console.log();
        await menus.emojis.main(token);
        return;
    }
    searching.succeed(`Image files available for upload: ${data.length}`);

    const procceed = await prompts.confirm({
        message: "Do you want to confirm the image files upload process?"
    });

    if (!procceed){
        await menus.emojis.main(token);
        return;
    }

    const overwrite = await prompts.select({
        message: "Select the overwrite method",
        choices: [
            {
                name: "✎ Overwrite if exists",
                value: "all"
            },
            {
                name: "▣ Ask before overwrite",
                value: "ask"
            },
            {
                name: "◎ Skip and do not overwrite",
                value: "skip"
            },
        ]
    });

    await actions.emojis.upload({
        data, emojis, overwrite, token
    });
    console.log();
    log.success("Uploading process completed!");
    console.log();

    await menus.emojis.main(token);
}