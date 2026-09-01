import { actions } from "#actions";
import { menus } from "#menus";
import { api } from "#shared/api.js";
import { ck } from "#utils/ck.js";
import { log } from "#utils/log.js";
import { input, select } from "@inquirer/prompts";
import type { DiscordBotToken } from "../../shared/token.js";

export async function emojisFileMenu(token: DiscordBotToken) {
    const result = await api.emojis.fetch(token.id, token.token);
    if (!result.success){
        log.error(result.error);
        await menus.emojis.main(token);
        return;
    }
    const dist = await input({
        message: "Emoji file path",
        default: "./emojis.json",
        // validate(value){
        //     if (!value.endsWith(".json")){
        //         throw new Error("The file extension must be .json");
        //     }
        // }
    });

    const type = await select<"id" | "url">({
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