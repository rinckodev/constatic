import { sleep } from "#helpers";
import { menus } from "#menus";
import { DiscordBotToken, ProgramMenuProps } from "#types";
import ck from "chalk";
import Table from "cli-table3";
import { fetchDiscordEmojis } from "./fetch.js";

export async function discordEmojisListMenu(props: ProgramMenuProps, token: DiscordBotToken){
    const emojis = await fetchDiscordEmojis(props, token);
    if (!emojis) return;

    const table = new Table({
        head: [ck.white("Type"), ck.white("ID"), ck.white("Name")],
        style: { compact: true },
    });

    emojis.forEach(emoji => table.push([
        emoji.animated ? ck.magenta("animated") : ck.cyan("static"),
        ck.green(emoji.id),
        ck.yellow(emoji.name),
    ]))

    console.log(table.toString());

    await sleep(1000);

    menus.discord.emojis.main(props, token);
}