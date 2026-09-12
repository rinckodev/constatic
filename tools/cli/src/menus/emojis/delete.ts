import { menus } from "#menus";
import { api } from "#shared/api.js";
import { prompts } from "#shared/prompts.js";
import { DiscordBotToken } from "#shared/token.js";
import { ck } from "#utils/ck.js";
import { log } from "#utils/log.js";
import { createSpinner } from "#utils/spinner.js";

export async function emojisDeleteMenu(token: DiscordBotToken) {
    const fetching = createSpinner("Fetching application emojis");
    const result = await api.emojis.fetch(token.id, token.token);
    if (!result.success) {
        fetching.fail(result.error);
        await menus.emojis.main(token);
        return;
    }
    fetching.stop();

    const selected = await prompts.multifilter({
        message: "Select the emojis you want to delete",
        choices: result.data.map(emoji => ({
            name: [
                emoji.animated
                    ? ck.magenta("(animated)")
                    : ck.cyan("(static)")
                ,
                ck.yellow(emoji.name),
                ck.dim.green(emoji.id)
            ].join(" "),
            value: emoji.id
        })),
        pageSize: 8,
    });
    console.log();

    if (selected.length < 1) {
        log.warn("No emoji selected, back to emojis menu");
        await menus.emojis.main(token);
        return;
    }

    const procceed = await prompts.select({
        message: `Number of emojis that will be deleted: ${selected.length}`,
        choices: [
            {
                name: ck.red("Confirm and delete"),
                value: true,
            },
            {
                name: ck.dim("Cancel"),
                value: false,
            },
        ]
    });
    if (!procceed) {
        await menus.emojis.main(token);
        return;
    }
    await Promise.all(result.data
        .filter(e => selected.includes(e.id))
        .map(async emoji => {
            const name = ck.yellow.underline(emoji.name);

            const deleteResult = await api.emojis.delete(token, emoji.id);
            if (!deleteResult.success) {
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