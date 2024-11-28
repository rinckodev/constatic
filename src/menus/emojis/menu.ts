import ck from "chalk";
import { menus } from "#menus";
import { BotToken, ProgramMenuProps } from "#types";
import { actionsPrompt } from "./prompts/actions.js";
import { log } from "@clack/prompts";
import { setTimeout } from "node:timers/promises";
import { tokenPrompt } from "./prompts/token.js";

export async function discordEmojisMenu(props: ProgramMenuProps, token?: BotToken){
    if (!token){
        const tokens = props.conf.get("discord.bot.tokens", []) as BotToken[];
        if (!tokens.length){
            log.warn("You don't have any tokens saved yet! Go to the settings in the main menu.");
            await setTimeout(1400);
            menus.main(props);
        }
        const index = await tokenPrompt(tokens);
        if (index == -1){
            menus.main(props);
            return;
        }
        token = tokens[index];
    }

    log.message(ck.green(`${ck.blue("🤖 Selected application:")} ${token.name}`))

    const title = ck.cyan.underline(`❑ Discord emojis menu`);
    const action = await actionsPrompt(title);

    switch(action){
        case "list":{
            menus.emojis.list(props, token);
            return;
        }
        case "upload":{
            menus.emojis.upload(props, token);
            return;
        }
        case "delete":{
            menus.emojis.delete(props, token);
            return;
        }
        case "file":{
            menus.emojis.file(props, token);
            return;
        }
        case "select":{
            menus.emojis.main(props);
            return;
        }
        case "main":{
            menus.main(props);
            return;
        }
    }
}