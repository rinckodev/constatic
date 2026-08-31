import { APIEmoji } from "#shared/emojis.js";
import { ck } from "#utils/ck.js";
import Table from "cli-table3";

export async function emojisListAction(emojis: APIEmoji[]) {
    const table = new Table({
        head: ["name", "id", "type"].map(ck.white),
        style: { compact: true },
    });

    for(const { id, name, animated } of emojis){
        table.push([
            ck.yellow(name),
            ck.green(id),
            animated 
                ? ck.magenta("animated") 
                : ck.cyan("static")
        ]);
    }
    console.log(table.toString())
    console.log();
}