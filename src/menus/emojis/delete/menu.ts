import { deleteDiscordEmoji, getDiscordEmojis } from "#helpers";
import { menus } from "#menus";
import { BotToken, ProgramMenuProps } from "#types";
import { confirm, log, spinner } from "@clack/prompts";
import ck from "chalk";
import { setTimeout } from "node:timers/promises";

export async function discordEmojisDeleteMenu(props: ProgramMenuProps, token: BotToken){
    const existingEmojis = await getDiscordEmojis(token)
    if (!existingEmojis.success){
        log.error("Unable to get application emojis");
        await setTimeout(400);
        menus.emojis.main(props, token);
        return;
    }
    const amount = existingEmojis.data.length;
    if (!amount){
        log.error("No emojis to delete");
        await setTimeout(400);
        menus.emojis.main(props, token);
        return;
    }

    const procced = await confirm({
        message: `You are about to delete ${amount} emoji${amount > 1 ? "s":""}, do you want to continue?`
    });

    if (!procced){
        await setTimeout(400);
        menus.emojis.main(props, token);
        return;
    }

    const deleting = spinner();

    for(const emoji of existingEmojis.data){
        const name = ck.yellow.underline(emoji.name);
        deleting.start(`Deleting emoji: ${name}`);
        const result = await deleteDiscordEmoji(token, emoji.id);
        if (!result.success){
            deleting.stop(`An error occurred while trying to delete the emoji: ${name}`, 1);
            continue;
        }
        deleting.stop(`Emoji ${name} successfully deleted`);
    }

    log.success("Deleting process completed!")
    await setTimeout(400);
    menus.emojis.main(props, token);
}