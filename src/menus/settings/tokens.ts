import { log, note, password, select, spinner } from "@clack/prompts";
import chalk from "chalk";
import { checkCancel } from "../../helpers/index.js";
import { settingsMainMenu } from "./main.js";
import { setTimeout } from "node:timers/promises";
import { getDiscordBotInvite } from "../../helpers/discord.js";

export async function settingsDiscordBotTokensMenu(props: ProgramProps){
    const option = await select({
        message: "Select an option",
        options: [
            { label: chalk.blue("List saved tokens"), value: "list" },
            { label: chalk.green("Save new token"), value: "new" },
            { label: chalk.red("Delete a token"), value: "delete" },
            { label: chalk.red("Back"), value: "back" },
        ]
    }) as string;

    checkCancel(option);

    const tokens = props.conf.get("discord.bot.tokens", []) as DiscordBotToken[];

    switch(option){
        case "list":{
            if (!tokens.length){
                log.warn("No tokens saved yet...");
                await setTimeout(1200);
                break;
            }
            note(tokens.map(({ name }) => `- ${name}: ${"*".repeat(12)}`).join("\n"))
            await setTimeout(1200);
            break;
        }
        case "new":{
            const token = await password({
                message: "Insert your discord bot token",
                mask: "*"
            }) as string;

            checkCancel(token);
            if (tokens.some(t => t.token === token)){
                log.warn("This token is already saved");
                break;
            }
            
            const fetching = spinner();
            fetching.start("Wait");
            
            const result = await getDiscordBotInvite(token);
            
            if (!result.success){
                fetching.stop("The provided token is invalid", 1);
                break;
            }
            const { name, invite, id } = result;
            
            tokens.push({ name, invite, id, token });

            props.conf.set("discord.bot.tokens", tokens);

            fetching.stop("Token saved successfully!");

            await setTimeout(1200);
            break;
        }
        case "delete":{
            const token = await select({
                message: "Select a token",
                options: [
                    tokens.map(({ name, token }) => ({
                        label: name, value: token
                    })),
                    { label: chalk.red("Back"), value: "back" },
                ].flat()
            }) as string;

            checkCancel(token);

            if (token === "back") break;

            const filtered = tokens.filter(t => t.token !== token);
            props.conf.set("discord.bot.tokens", filtered);

            log.success("Token removed successfully!");

            await setTimeout(1200);
            break;
        }
        default: {
            settingsMainMenu(props);
            return;
        }
    }
    settingsDiscordBotTokensMenu(props);
}