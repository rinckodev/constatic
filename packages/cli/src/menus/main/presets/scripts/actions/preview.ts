import { buildAndFormatTree, divider, printRecordTree, uiMessage } from "#helpers";
import { ScriptPreset } from "#types";
import ck from "chalk";

export function printPreview(preset: ScriptPreset) {
    if (preset.files.length) {
        const paths = preset.files.map(p => p.dist ?? p.path);
        console.log(uiMessage({
            "en-US": "🗐 Files:",
            "pt-BR": "🗐 Arquivos:",
        }, ck.bold));
        console.log(buildAndFormatTree(paths));
        console.log(uiMessage({
            "en-US": `Total files: ${preset.files.length}`,
            "pt-BR": `Total de arquivos: ${preset.files.length}`,
        }));
        divider();
    }
    if (preset.packageJson) {
        for (const [prop, record] of Object.entries(preset.packageJson)) {
            if (!Object.keys(record).length) continue;
            printRecordTree(ck.bold(`${prop}:`), record);
        }
    }
}