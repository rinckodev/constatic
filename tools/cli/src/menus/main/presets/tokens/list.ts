import { cliTableChars, divider } from "#helpers";
import { menus } from "#menus";
import { DiscordBotToken } from "#shared/token.js";
import { ck } from "#utils/ck.js";
import Table from "cli-table3";

export async function presetsTokensListMenu(tokens: DiscordBotToken[]) {
    const cc = {
        name: ck.white("Name"),
        id: ck.white("ID"),
    }

    const table = new Table({
        head: [cc.name, cc.id],
        style: { compact: true },
        chars: cliTableChars
    });

    tokens.forEach(token => table.push([
        ck.yellow(token.name),
        ck.green(token.id),
    ]));

    console.log(table.toString());
    divider();
    await menus.presets.tokens.main();
}