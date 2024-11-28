import { getDiscordEmojis } from "#helpers";
import { menus } from "#menus";
import { BotToken, ProgramMenuProps } from "#types";
import { note, spinner } from "@clack/prompts";
import ck from "chalk";
import { setTimeout } from "node:timers/promises";

export async function discordEmojisListMenu(props: ProgramMenuProps, token: BotToken){
    const loading = spinner();
    loading.start("Wait");

    const result = await getDiscordEmojis(token);
    if (!result.success){
        loading.stop(`An error occurred while fetching ${token.name}'s emojis`, 1)
        await setTimeout(1400);
        menus.emojis.main(props, token);
        return;
    }

    const amount = result.data.length;
    if (!amount){
        loading.stop("No emojis to list", 1);
        await setTimeout(400);
        menus.emojis.main(props, token);
        return;
    }
    
    loading.stop("Checks completed!");

    const list = result.data.map(emoji => ({
        type: emoji.animated ? ck.magenta("animated") : ck.cyan("static"),
        id: emoji.id,
        name: emoji.name,
    }));
    
    note(
        list.map(emoji => 
            `${emoji.type} | ${ck.green(emoji.id)} | ${ck.yellow(emoji.name)} `
        ).join("\n"), 
        `Application emojis: ${result.data.length}`
    );

    await setTimeout(400);
    menus.emojis.main(props, token);
}