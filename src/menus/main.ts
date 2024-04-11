import { outro, select } from "@clack/prompts";
import chalk from "chalk";
import { checkCancel, messages } from "../helpers";
import { discordBotMainMenu } from "./discordbot/main";

export async function MainMenu(props: ProgramProps){
    const selected = await select({
        message: "Select action",
        options: [
            { label: chalk.hex("#4cc58c")("Init discord bot project"), value: "discordbot" },  
            { label: chalk.hex("#ce5353")("Quit"), value: "quit" },  
        ],
    })

    checkCancel(selected);

    switch(selected){
        case "discordbot":{
            discordBotMainMenu(props);
            return;
        }
        case "quit":{
            outro(messages().bye());
            process.exit(0);
        }
    }
}