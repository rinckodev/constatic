export * from "./discord/emojis.js";
export * from "./discord/tokens.js";

export * from "./conf.js";
export * from "./files.js";
export * from "./ui.js";
export * from "./shell.js";
export * from "./log.js";
export * from "./validation.js";
export * from "./npm.js";
export * from "./agent.js";
export * from "./env.js";

import ck from "chalk";

export const byeMessage = [
    `👋 Discord: ${ck.blue("http://discord.gg/tTu8dGN")}`,
    `😺 ${ck.cyan("Github")} / ${ck.red("youtube")}: @rinckodev`,
].join("\n")

function onCancel(error: any){
    if (error.name !== "ExitPromptError") {
        throw error;
    };
    console.log(byeMessage);
    console.log();
    process.exit(0);
}

process.on("unhandledRejection", onCancel);
process.on("uncaughtException", onCancel);