import { select } from "@clack/prompts";
import { checkCancel } from "../../helpers/index.js";
import chalk from "chalk";
import { menus } from "../index.js";

export async function settingsMainMenu(props: ProgramProps){
    const selected = await select({
        message: "Select an option",
        options: [
            { label: chalk.green("Discord bot tokens"), value: "discordbot-tokens" },
            { label: chalk.red("Main menu"), value: "mainmenu" },
        ]
    }) as string;

    checkCancel(selected);

    switch(selected){
        case "discordbot-tokens":{
            menus.settings.tokens(props);
            return;
        }
        default: {
            menus.program.main(props);
        }
    }
}