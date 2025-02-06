import { cliTableChars, divider, sleep, uiText } from "#helpers";
import { menus } from "#menus";
import { DiscordBotToken, ProgramMenuProps } from "#types";
import ck from "chalk";
import Table from "cli-table3";
import { fetchDiscordEmojis } from "./fetch.js";

export async function discordEmojisListMenu(props: ProgramMenuProps, token: DiscordBotToken){
    const emojis = await fetchDiscordEmojis({ props, token });
    if (!emojis) return;

    const cc = {
        name: uiText(props.lang, 
            { "en-US": "Name", "pt-BR": "Nome", },
            ck.white
        ),
        id: uiText(props.lang, 
            { "en-US": "ID", "pt-BR": "ID", },
            ck.white
        ),
        type: uiText(props.lang, 
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
    menus.discord.emojis.main(props, token);
}