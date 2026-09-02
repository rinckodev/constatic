import { ck } from "./ck.js";

export function quit(){
    console.log()
    console.log(
        `👋 Discord: ${ck.blue("http://discord.gg/tTu8dGN")}`
    );
    console.log(
        `😺 ${ck.cyan("Github")} / ${ck.red("youtube")}: @rinckodev`,
    );
    console.log()
    process.exitCode = 0;
}

function handleCancel(error: unknown){
    if (error instanceof Error && error.name === "ExitPromptError"){
        quit();
        return;
    }
    throw error;
}


export function registerCancelHandler(){
    process.on("uncaughtException", handleCancel);
    process.on("unhandledRejection", handleCancel);
}