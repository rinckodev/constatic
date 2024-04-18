import { outro, select } from "@clack/prompts";
import chalk from "chalk";
import { checkCancel, messages } from "../helpers/index.js";
import { discordBotInitMenu } from "./discordbot/main.js";
import { settingsMainMenu } from "./settings/main.js";

export async function mainMenu(props: ProgramProps){
    const selected = await select({
        message: "Select action",
        options: [
            { label: chalk.green("Init discord bot project"), value: "discordbot-init" },  
            { label: chalk.blue("Settings"), value: "settings" },  
            { label: chalk.red("Quit"), value: "quit" },  
        ],
    })

    checkCancel(selected);

    switch(selected){
        case "discordbot-init":{
            discordBotInitMenu(props);
            return;
        }
        case "settings":{
            settingsMainMenu(props);
            return;
        }
        case "quit":{
            outro(messages().bye());
            process.exit(0);
        }
    }
}