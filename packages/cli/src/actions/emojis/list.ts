import { CLI } from "#cli";
import { cliTableChars, uiMessage } from "#helpers";
import { fetchDiscordEmojis } from "#shared/emojis/fetch.js";
import { DiscordBotToken } from "#types";
import ck from "chalk";
import Table from "cli-table3";

interface ListEmojisActionData {
    token: DiscordBotToken;
    // type?: string;
}
export async function listEmojisAction(cli: CLI, data: ListEmojisActionData) {
    const emojis = await fetchDiscordEmojis({ cli, token: data.token });
    if (!emojis) return;

    const cc = {
        name: uiMessage(
            { "en-US": "Name", "pt-BR": "Nome", },
            ck.white
        ),
        id: uiMessage(
            { "en-US": "ID", "pt-BR": "ID", },
            ck.white
        ),
        type: uiMessage(
            { "en-US": "Type", "pt-BR": "Tipo", },
            ck.white
        ),
    }

    const table = new Table({
        head: [cc.name, cc.id, cc.type],
        style: { compact: true },
        chars: cliTableChars,
    });

    emojis.forEach(emoji => table.push([
        ck.yellow(emoji.name),
        ck.green(emoji.id),
        emoji.animated ? ck.magenta("animated") : ck.cyan("static"),
    ]));

    console.log(table.toString());
}