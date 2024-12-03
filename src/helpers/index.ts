export * from "./discord/emojis.js";
export * from "./discord/tokens.js";

export * from "./conf.js";
export * from "./files.js";
export * from "./ui.js";
export * from "./shell.js";
export * from "./log.js";
export * from "./validation.js";
export * from "./npm.js";

import ck from "chalk";

export const byeMessage = [
    `👋 Discord: ${ck.blue("http://discord.gg/tTu8dGN")}`,
    `😺 ${ck.cyan("Github")} and ${ck.red("youtube")}: @rinckodev`,
].join("\n")

function onCancel(error: any){
    if (error.name !== "ExitPromptError") return;
    console.log(byeMessage);
    process.exit(0);
}

process.on("unhandledRejection", onCancel);
process.on("uncaughtException", onCancel);