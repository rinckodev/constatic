import { CLI } from "#cli";
import { uiMessage, divider, sleep, cliTableChars } from "#helpers";
import { menus } from "#menus";
import { ScriptPreset } from "#types";
import ck from "chalk";
import Table from "cli-table3";

export async function presetsScriptsListMenu(cli: CLI, presets: ScriptPreset[]) {
    const cc = {
        name: uiMessage( 
            { "en-US": "Name", "pt-BR": "Nome", },
            ck.white
        ),
        id: uiMessage( 
            { "en-US": "ID", "pt-BR": "ID", },
            ck.white
        ),
        files: uiMessage( 
            { "en-US": "Files", "pt-BR": "Arquivos", },
            ck.white
        ),
        deps: uiMessage( 
            { "en-US": "Dependencies", "pt-BR": "Dependências", },
            ck.white
        )
    }

    const table = new Table({
        head: [cc.name, cc.id, cc.files, cc.deps],
        style: { compact: true },
        chars: cliTableChars
    });

    presets.forEach(preset => table.push([
        ck.yellow(preset.name),
        ck.green(preset.id),
        ck.greenBright(preset.files.length),
        ck.greenBright(
            Object.values(preset.packageJson??{})
                .map(record => Object.values(record)).flat().length
        )
    ]));

    console.log(table.toString());
    divider();
    
    await sleep(400);
    menus.presets.scripts.main(cli);
}