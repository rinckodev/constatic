import { outro, select } from "@clack/prompts";
import { DiscordBotMenu } from "./discordbot";
import chalk from "chalk";

export async function MainMenu(props: ProgramProps){
    const selected = await select({
        message: "Select action",
        options: [
            { label: "Init discord bot", value: "discordbot" },  
            { label: chalk.red("Quit"), value: "quit" },  
        ],
    })

    switch(selected){
        case "discordbot":{
            DiscordBotMenu(props);
            return;
        }
        case "quit":{
            outro("You quit");
            process.exit(0);
        }
    }
}