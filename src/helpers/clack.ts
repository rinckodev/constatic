import { isCancel, outro } from "@clack/prompts";
import chalk from "chalk";

export function checkCancel<T>(value: T, message?: string) {
    if (isCancel(value)){
        outro(message ?? messages().bye());
        process.exit();
    }
}

export function messages(){
    return {
        bye: () => `👋 Discord: ${chalk.blue("http://discord.gg/tTu8dGN")}`
    }
}