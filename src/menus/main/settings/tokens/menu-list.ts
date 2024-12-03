import { uiText, divider, sleep, cliTableChars } from "#helpers";
import { menus } from "#menus";
import { ProgramMenuProps } from "#types";
import ck from "chalk";
import Table from "cli-table3";
import { getDiscordTokens } from "./get.js";

export async function settingsTokensListMenu(props: ProgramMenuProps) {
    const tokens = await getDiscordTokens(props);
    if (!tokens) return;

    const cc = {
        name: uiText(props.lang, 
            { "en-US": "Name", "pt-BR": "Nome", },
            ck.white
        ),
        id: uiText(props.lang, 
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
    menus.settings.tokens.main(props);
}