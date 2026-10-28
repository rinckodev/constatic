import { cliTableChars } from "#helpers";
import type { ScriptPreset } from "#program";
import { ck } from "#utils/ck.js";
import Table from "cli-table3";

export async function scriptsListAction(presets: ScriptPreset[]) {
    const cc = {
        name: ck.white("Name"),
        id: ck.white("ID"),
        files: ck.white("Files"),
        deps: ck.white("Dependencies")
    }

    const table = new Table({
        head: [cc.name, cc.id, cc.files, cc.deps],
        style: { compact: true },
        chars: cliTableChars
    });

    for(const preset of presets){
        table.push([
            ck.yellow(preset.name),
            ck.green(preset.id),
            ck.greenBright(preset.files.length.toString()),
            ck.greenBright(
                Object.values(preset.packageJson??{})
                    .map(record => Object.values(record)).flat().length.toString()
            )
        ])
    }

    console.log(table.toString());
    console.log();
}