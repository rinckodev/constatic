import { actions } from "#actions";
import { menus } from "#menus";
import { api } from "#shared/api.js";
import { prompts } from "#shared/prompts.js";
import { DiscordBotToken } from "#shared/token.js";
import { ck } from "#utils/ck.js";
import { createSpinner } from "#utils/spinner.js";

export async function emojisFileMenu(token: DiscordBotToken) {
    const fetching = createSpinner()
        .start("Fetching application emojis");
    const result = await api.emojis.fetch(token.id, token.token);
    if (!result.success){
        fetching.fail(result.error);
        await menus.emojis.main(token);
        return;
    }
    fetching.stop();
    const dist = await prompts.input({
        message: "Emoji file path",
        default: "./emojis.json",
        validate(value){
            if (!value.endsWith(".json")){
                return "The file extension must be .json";
            }
            return true;
        }
    });

    const type = await prompts.select<"id" | "url">({
        message: "Emoji file type",
        default: "id",
        choices: [
            {
                name: `${ck.green("ID")} → File containing emoji IDs`,
                value: "id"
            },
            {
                name: `${ck.green("URL")} → File containing emoji URLs`,
                value: "url"
            },
        ]
    });

    const writeResult = await actions.emojis.file({
        dist, emojis: result.data, type
    });

    if (!writeResult.success){
        console.error(writeResult.error);
    }
    await menus.emojis.main(token);
}