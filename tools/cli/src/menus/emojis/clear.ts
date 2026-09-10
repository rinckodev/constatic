import { menus } from "#menus";
import { api } from "#shared/api.js";
import { prompts } from "#shared/prompts.js";
import { DiscordBotToken } from "#shared/token.js";
import { ck } from "#utils/ck.js";
import { log } from "#utils/log.js";

export async function emojisClearMenu(token: DiscordBotToken) {
    const result = await api.emojis.fetch(token.id, token.token);
    if (!result.success) {
        log.error(result.error);
        await menus.emojis.main(token);
        return;
    }
    const emojis = result.data;

    if (emojis.length < 1){
        log.warn("No emojis to delete!");
        await menus.emojis.main(token);
        return;
    }
    
    const procceed = await prompts.select({
        message: `All emojis in your application will be deleted!`,
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
    if (!procceed){
        await menus.emojis.main(token);
        return;
    }

    await Promise.all(
        emojis.map(async emoji => {
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
    log.success("Clear emojis process completed!");
    console.log();

    await menus.emojis.main(token);

}