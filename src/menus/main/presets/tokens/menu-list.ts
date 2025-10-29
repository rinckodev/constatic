import type { DiscordBotToken } from "#types";
import { cliTableChars, divider, sleep, uiMessage } from "#helpers";
import { menus } from "#menus";
import ck from "chalk";
import Table from "cli-table3";
import { CLI } from "#cli";

export async function presetsTokensListMenu(cli: CLI, tokens: DiscordBotToken[]) {
    const cc = {
        name: uiMessage( 
            { "en-US": "Name", "pt-BR": "Nome", },
            ck.white
        ),
        id: uiMessage( 
            { "en-US": "ID", "pt-BR": "ID", },
            ck.white
        )
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
    
    await sleep(500);
    menus.presets.tokens.main(cli);
}