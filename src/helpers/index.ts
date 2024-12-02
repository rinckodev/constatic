export * from "./discord/emojis.js";

export * from "./conf.js";
export * from "./files.js";
export * from "./ui.js";
export * from "./log.js";

import ck from "chalk";

function onCancel(error: any){
    if (error.name !== "ExitPromptError") return;
    console.log([
        `👋 Discord: ${ck.blue("http://discord.gg/tTu8dGN")}`,
        `😺 ${ck.cyan("Github")} and ${ck.red("youtube")}: @rinckodev`,
    ].join("\n"));
    process.exit(0);
}

process.on("unhandledRejection", onCancel);
process.on("uncaughtException", onCancel);