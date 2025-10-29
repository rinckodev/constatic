export * from "./discord/emojis.js";
export * from "./discord/tokens.js";

export * from "./npm/package.js";

export * from "./files.js";
export * from "./format.js";
export * from "./lang.js";
export * from "./log.js";
export * from "./ui.js";
export * from "./validation.js";
export * from "./morph/functions.js";
export * from "./morph/objects.js";
export * from "./prompts.js";

import ck from "chalk";

export const byeMessage = [
    `👋 Discord: ${ck.blue("http://discord.gg/tTu8dGN")}`,
    `😺 ${ck.cyan("Github")} / ${ck.red("youtube")}: @rinckodev`,
].join("\n")

function onCancel(error: any): never {
    if (error instanceof Error && error.name === "ExitPromptError") {
        console.log();
        console.log(byeMessage);
        console.log();
        process.exit(0);
    }
    throw error;
}

process.on("unhandledRejection", onCancel);
process.on("uncaughtException", onCancel);