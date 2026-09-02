import { buildAndFormatTree, printRecordTree } from "#helpers";
import { ScriptPreset } from "#types";
import { ck } from "#utils/ck.js";

export function printPreview(preset: ScriptPreset) {
    if (preset.files.length) {
        const paths = preset.files.map(p => p.dist ?? p.path);
        console.log(ck.bold("🗐 Files:"));
        console.log(buildAndFormatTree(paths));
        console.log(`Total files: ${preset.files.length}`);
        console.log();
    }
    if (preset.packageJson) {
        for (const [prop, record] of Object.entries(preset.packageJson)) {
            if (!Object.keys(record).length) continue;
            printRecordTree(ck.bold(`${prop}:`), record);
        }
    }
}