import { menus } from "#menus";
import { ck } from "#utils/ck.js";
import { select } from "@inquirer/prompts";
import { DiscordBotToken } from "../../shared/token.js";
import { selectBotMenu } from "./select.js";

export async function emojisMenu(token?: DiscordBotToken){
    if (!token){
        const result = await selectBotMenu();
        if (!result.success){
            if (result.error === "back"){
                // await menus.main(); TODO
                return;
            }
            console.error(ck.red(`✖︎ ${result.error}`));
            await emojisMenu();
            return;
        }
        token = result.data;
    }
    const menu = await select({
        message: `Manage emojis ${ck.green.dim(`🤖 ${token.name}`)}`,
        // theme: {
        //     message: m => ck.reset.cyan(m),
        //     prefix: () => ck.reset.cyan("❑")
        // },
        choices: [
            {
                name: ck.blue("☰ List emojis"),
                value: "list"
            },
            {
                name: ck.green("↥ Upload emojis"),
                value: "upload"
            },
            {
                name: ck.blue("↯ Generate emojis file"),
                value: "file"
            },
            {
                name: ck.red("✗ Delete emojis"),
                value: "delete"
            },
            {
                name: ck.red("✗ Clear emojis"),
                value: "clear"
            },
            {
                name: ck.yellowBright("⤷ Swap application"),
                value: "swap"
            },
            {
                name: ck.gray("⤶ Back"),
                value: "back"
            },
        ]
    });

    switch(menu){
        case "file":
        case "upload":
        case "delete":
        case "list":{
            const showMenu = menus.emojis[menu];
            await showMenu(token);
            return;
        }
        case "swap":{
            await emojisMenu();
            return;
        }
        default:{
            // await menus.main(); TODO
        }
    }
}