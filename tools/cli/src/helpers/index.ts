import { ck } from "#utils/ck.js";

export * from "./npm/package.js";

export * from "./files.js";
export * from "./format.js";
export * from "./lang.js";
export * from "./morph/functions.js";
export * from "./morph/objects.js";
export * from "./prompts.js";
export * from "./ui.js";
export * from "./validation.js";

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