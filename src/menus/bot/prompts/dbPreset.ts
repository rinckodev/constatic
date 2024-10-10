import { handlePrompt } from "#helpers";
import { BotDatabasePreset } from "#types";
import * as clack from "@clack/prompts";
import ck from "chalk";

export function dbPresetPrompt(presets: BotDatabasePreset[]){
    const options = presets
    .filter(preset => preset.disabled !== true)
    .map(({ icon, name, hint }, index) => ({
        label: `${icon} ${name} ${ck.dim(`(${hint})`)}`, 
        value: index,
    }));
    options.unshift({ label: "None", value: -1 });

    return handlePrompt(clack.select({
        message: ck.bold(`🧰 Database preset`), 
        options,
    })) satisfies Promise<number>;
}