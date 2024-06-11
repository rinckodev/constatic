import { isCancel, outro } from "@clack/prompts";
import chalk from "chalk";

export const messages = {
    bye: `👋 Discord: ${chalk.blue("http://discord.gg/tTu8dGN")}`
}
export function handleCancel<T>(value: T | symbol, message?: string): asserts value is T {
    if (isCancel(value)){
        outro(message ?? messages.bye);
        process.exit(0);
    }
}
