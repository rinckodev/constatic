import { outro, select } from "@clack/prompts";
import chalk from "chalk";
import { menus } from "../index.js";
import { handleCancel, messages } from "../../helpers/index.js";

export async function programMainMenu(props: ProgramProps){
    const selected = await select({
        message: "Select action",
        options: [
            { label: chalk.green("Init discord bot project"), value: "bot-init" },  
            { label: chalk.blue("Settings"), value: "settings" },  
            { label: chalk.red("Quit"), value: "quit" },  
        ],
    }) as string;

    handleCancel(selected);

    switch(selected){
        case "bot-init":{
            menus.bot.init(props);
            return;
        }
        case "settings":{
            menus.settings.main(props);
            return;
        }
        case "quit":{
            outro(messages.bye);
            process.exit(0);
        }
    }
}