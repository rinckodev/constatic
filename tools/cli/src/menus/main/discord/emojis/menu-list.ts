import { CLI } from "#cli";
import { cliTableChars, divider, sleep, uiMessage } from "#helpers";
import { menus } from "#menus";
import { fetchDiscordEmojis } from "#shared/emojis/fetch.js";
import { DiscordBotToken } from "#types";
import { ck } from "#utils/ck.js";
import Table from "cli-table3";

export async function discordEmojisListMenu(cli: CLI, token: DiscordBotToken){
    const emojis = await fetchDiscordEmojis({ cli, token });
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
    divider();
    
    await sleep(500);
    menus.discord.emojis.main(cli, token);
}