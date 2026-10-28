import { actions } from "#actions";
import { menus } from "#menus";
import { api } from "#shared/api.js";
import { ck } from "#utils/ck.js";
import { createSpinner } from "#utils/spinner.js";
import { DiscordBotToken } from "../../shared/token.js";

export async function emojisListMenu(token: DiscordBotToken){
    const fetching = createSpinner()
        .start("Fetching application emojis");
    const result = await api.emojis.fetch(token.id, token.token);
    if (!result.success){
        fetching.fail(ck.red(`✖︎ ${result.error}`));
        await menus.emojis.main(token);
        return;
    }
    fetching.stop();
    actions.emojis.list(result.data);
    await menus.emojis.main(token);
}