import { isCancel, outro } from "@clack/prompts";
import ck from "chalk";

export const messages = {
    bye: [
        `👋 Discord: ${ck.blue("http://discord.gg/tTu8dGN")}`,
        `   😺 ${ck.cyan("Github")} and ${ck.red("youtube")}: @rinckodev`,
    ].join("\n")
}
export async function handlePrompt<T>(result: Promise<T>, message?: string): Promise<Exclude<T, symbol>> {
    const value = await result;
    if (isCancel(value)){
        outro(message ?? messages.bye);
        process.exit(0);
    }
    return value as Promise<Exclude<T, symbol>>
}