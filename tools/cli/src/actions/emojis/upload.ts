import { api } from "#shared/api.js";
import { APIEmoji, UploadEmojisData } from "#shared/emojis.js";
import { DiscordBotToken } from "#shared/token.js";
import { ck } from "#utils/ck.js";
import { log } from "#utils/log.js";
import { createSpinner } from "#utils/spinner.js";
import { confirm } from "@inquirer/prompts";

interface EmojisUploadActionProps {
    emojis: APIEmoji[],
    data: UploadEmojisData[], 
    overwrite: string,
    token: DiscordBotToken
}

export async function emojisUploadAction(props: EmojisUploadActionProps) {
    const { data, emojis, overwrite, token } = props;
    for(const info of data){
        const name = ck.underline.yellow(info.name);
        const existing = emojis.find(
            e => e.name.toLowerCase() === info.name.toLowerCase()
        );

        if (existing){
            const deleteThisEmoji = async () => {
                const deleting = createSpinner(`Deleting ${name} emoji...`);
                const result = await api.emojis.delete(token, existing.id);
                if (!result.success){
                    deleting.fail(`Could not delete the emoji ${name}: ${result.error}`);
                }
                deleting.stop();
            }
            switch(overwrite){
                case "all":{
                    await deleteThisEmoji();
                    break;
                }
                case "ask":{
                    log.warn(`An emoji named ${name} already exists.`);
                    const procceed = await confirm({
                        message: "Do you want to overwrite?"
                    });
                    if (!procceed) continue;
                    await deleteThisEmoji();
                    break;
                }
                case "skip":{
                    log.custom(ck.yellow("◎"), 
                        `${ck.bold.yellow("Skipped")} → ${name} already exists!`
                    );
                    continue;
                }
            }
        }

        const uploading = createSpinner(
            `Uploading emoji ${name}`
        );
        const result = await api.emojis.upload(token, info);
        if (!result.success){
            uploading.fail(
                `An error occurred while trying ${existing ? "overwrite" : "create"} the ${name} emoji! \n${ck.red.dim(result.error)}`
            );
            continue;
        }
        uploading.stop();
        log.custom(ck.green("✦"), 
            `${ck.bold.green(existing ? "Overwrited" : "Created")} → ${ck.underline.dim.green(result.data.id)}`
        );
    }
}