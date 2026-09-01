import { menus } from "#menus";
import { api } from "#shared/api.js";
import { DiscordBotToken } from "#shared/token.js";
import { ck } from "#utils/ck.js";
import { log } from "#utils/log.js";
import { confirm } from "@inquirer/prompts";

export async function emojisDeleteMenu(token: DiscordBotToken) {
    const result = await api.emojis.fetch(token.id, token.token);
    if (!result.success) {
        log.error(result.error);
        await menus.emojis.main(token);
        return;
    }

    const selected: number[] = [];

    // const selected = await multifilter({
    //     message: "Select the emojis you want to delete",
    //     choices: result.data.map((emoji, index) => ({
    //         label: [
    //             emoji.animated
    //                 ? ck.magenta("(animated)")
    //                 : ck.cyan("(static)")
    //             ,
    //             ck.yellow(emoji.name),
    //             ck.dim.green(emoji.id)
    //         ].join(" "),
    //         value: index
    //     })),
    //     maxVisible: 12,
    //     placeholder: "Type to search...",
    // });
    console.log();

    if (selected.length < 1){
        log.warn("No emoji selected, back to emojis menu");
        await menus.emojis.main(token);
        return;
    }

    const procceed = await confirm({
        message: `Number of emojis that will be deleted: ${selected.length}`,
        // active: "Confirm and delete",
        // inactive: "Cancel",
        default: true
    });
    if (!procceed){
        await menus.emojis.main(token);
        return;
    }

    await Promise.all(
        selected.map(async index => {
            const emoji = result.data[index];
            const name = ck.yellow.underline(emoji.name);

            const deleteResult = await api.emojis.delete(token, emoji.id);
            if (!deleteResult.success){
                log.fail(`Could not delete the emoji ${name}: ${deleteResult.error}`);
                return;
            }
            log.custom(ck.red(log.icon.success),
                `${ck.red.bgRed("Deleted")} → ${name}`
            );
        })
    );
    console.log();
    log.success("Deleting process completed!");
    console.log();

    await menus.emojis.main(token);

}