import { BotToken, ProgramMenuProps } from "#types";
import { log, note } from "@clack/prompts";
import ck from "chalk";
import { setTimeout } from "node:timers/promises";
import { actionsPrompt, deleteTokenPrompt, newTokenPrompt } from "./prompts/index.js";
import { newTokenAction, deleteTokenAction } from "./actions/index.js";
import { menus } from "#menus";

export async function tokenSettingsMenu(props: ProgramMenuProps){
    const title = ck.cyan.underline("❑ Token settings menu");
    const action = await actionsPrompt(title);

    const tokens = props.conf.get("discord.bot.tokens", []) as BotToken[];

    switch(action){
        case "list":{
            if (!tokens.length){
                log.warn("No tokens saved yet...");
                await setTimeout(1200);
                break;
            }
            note(tokens.map(({ name }) => `- ${name}: ${"*".repeat(12)}`).join("\n"))
            await setTimeout(1200);
            break;
        }
        case "new":{
            const token = await newTokenPrompt();
            
            await newTokenAction({ token, tokens, conf: props.conf });
            break;
        }
        case "delete":{
            const token = await deleteTokenPrompt(tokens);

            await deleteTokenAction({ token, tokens, conf: props.conf });
            break;
        }
        case "back":{
            menus.settings.main(props);
            return;
        }
    }
    await tokenSettingsMenu(props);
}