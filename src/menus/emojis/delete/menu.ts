import { deleteDiscordEmoji, getDiscordEmojis, handlePrompt } from "#helpers";
import { menus } from "#menus";
import { BotToken, ProgramMenuProps } from "#types";
import { confirm, log, spinner } from "@clack/prompts";
import ck from "chalk";
import { setTimeout } from "node:timers/promises";

export async function discordEmojisDeleteMenu(props: ProgramMenuProps, token: BotToken){
    const loading = spinner();
    loading.start("Wait");

    const existingEmojis = await getDiscordEmojis(token)
    if (!existingEmojis.success){
        loading.stop("Unable to get application emojis", 1);
        await setTimeout(400);
        menus.emojis.main(props, token);
        return;
    }
    const amount = existingEmojis.data.length;
    if (!amount){
        loading.stop("No emojis to delete", 1);
        await setTimeout(400);
        menus.emojis.main(props, token);
        return;
    }

    loading.stop("Checks completed!");

    const procced = await handlePrompt(confirm({
        message: `You are about to delete ${amount} emoji${amount > 1 ? "s":""}, do you want to continue?`
    }));

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
        deleting.stop(ck.green(`Success! ${name} emoji ${ck.bgRed(" deleted ")}`));
    }

    log.success("Deleting process completed!")
    await setTimeout(400);
    menus.emojis.main(props, token);
}