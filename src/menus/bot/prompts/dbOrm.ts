import { handlePrompt } from "#helpers";
import { BotDatabasePreset } from "#types";
import * as clack from "@clack/prompts";
import ck from "chalk";

export function dbOrmPrompt(preset: BotDatabasePreset | undefined){
    return preset?.isOrm ? handlePrompt(clack.select({
        message: `${preset.icon} Select ${preset.name} database preset`,
        options: preset.databases.filter(preset => preset.disabled !== true)
        .map(({ icon, name, hint }, index) => ({
            label: `${icon} ${name} ${ck.dim(`(${hint})`)}`, 
            value: index,
        }))
    })) satisfies Promise<number> : -1;
}