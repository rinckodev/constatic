import { divider, sleep, uiText } from "#helpers";
import { menus } from "#menus";
import { DiscordBotToken, ProgramMenuProps } from "#types";
import ck from "chalk";
import Table from "cli-table3";
import { fetchDiscordEmojis } from "./fetch.js";

export async function discordEmojisListMenu(props: ProgramMenuProps, token: DiscordBotToken){
    const emojis = await fetchDiscordEmojis({ props, token });
    if (!emojis) return;

    const cc = {
        type: uiText(props.lang, 
            { "en-US": "Type", "pt-BR": "Tipo", },
            ck.white
        ),
        id: uiText(props.lang, 
            { "en-US": "ID", "pt-BR": "ID", },
            ck.white
        ),
        name: uiText(props.lang, 
            { "en-US": "Name", "pt-BR": "Nome", },
            ck.white
        ),
    }

    const table = new Table({
        head: [cc.type, cc.id, cc.name],
        style: { compact: true },
    });

    emojis.forEach(emoji => table.push([
        emoji.animated ? ck.magenta("animated") : ck.cyan("static"),
        ck.green(emoji.id),
        ck.yellow(emoji.name),
    ]))

    console.log(table.toString());
    divider();
    
    await sleep(500);
    menus.discord.emojis.main(props, token);
}