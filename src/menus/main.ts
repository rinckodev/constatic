import { outro, select } from "@clack/prompts";
import { DiscordBotMenu } from "./discordbot";

export async function MainMenu(){
    const selected = await select({
        message: "Select action",
        options: [
            { label: "Init discord bot", value: "discordbot" },  
            { label: "Quit", value: "quit" },  
        ],
    })

    switch(selected){
        case "discordbot":{
            DiscordBotMenu()
            return;
        }
        case "quit":{
            outro("You quit");
            process.exit(0);
        }
    }
}