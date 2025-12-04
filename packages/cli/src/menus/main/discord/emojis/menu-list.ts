import { cliTableChars, divider, sleep, uiMessage } from "#helpers";
import { menus } from "#menus";
import { DiscordBotToken } from "#types";
import ck from "chalk";
import Table from "cli-table3";
import { CLI } from "#cli";
import { fetchDiscordEmojis } from "#shared/emojis/fetch.js";

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