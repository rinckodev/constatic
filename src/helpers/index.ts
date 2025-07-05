export * from "./discord/emojis.js";
export * from "./discord/tokens.js";

export * from "./npm/package.js";

export * from "./helper.agent.js";
export * from "./helper.conf.js";
export * from "./helper.env.js";
export * from "./helper.files.js";
export * from "./helper.format.js";
export * from "./helper.lang.js";
export * from "./helper.log.js";
export * from "./helper.npm.js";
export * from "./helper.shell.js";
export * from "./helper.ui.js";
export * from "./helper.validation.js";
export * from "./morph/functions.js";
export * from "./morph/objects.js";

import ck from "chalk";

export const byeMessage = [
    `👋 Discord: ${ck.blue("http://discord.gg/tTu8dGN")}`,
    `😺 ${ck.cyan("Github")} / ${ck.red("youtube")}: @rinckodev`,
].join("\n")

function onCancel(_error: any){
    console.log(byeMessage);
    console.log();
    process.exit(0);
}

process.on("unhandledRejection", onCancel);
process.on("uncaughtException", onCancel);