import { CLI } from "#cli";
import { commonTexts, divider, uiMessage, withDefaults } from "#helpers";
import { menus } from "#menus";
import { DiscordBotToken } from "#types";
import { ck } from "#utils/ck.js";
import { select } from "@inquirer/prompts";
import { selectDiscordBot } from "./menu-select.js";

export async function discordEmojisMenu(cli: CLI, token?: DiscordBotToken){
    if (!token){
        await selectDiscordBot(cli);
        return;
    }
    
    const action = await select(withDefaults({
        message: uiMessage({
            "pt-BR": "❑ Gerenciar emojis",
            "en-US": "❑ Manage emojis",
        }, ck.reset.cyan.underline) +
        ck.green(` 🤖 ${token.name}`),
        choices: [
            { 
                name: uiMessage({
                    "en-US": "☰ List emojis",
                    "pt-BR": "☰ Listar emojis",
                }, ck.blue),
                value: "list" 
            },
            { 
                name: uiMessage({
                    "en-US": "↥ Upload emojis",
                    "pt-BR": "↥ Enviar emojis",
                }, ck.green),
                value: "upload" 
            },
            { 
                name: uiMessage({
                    "en-US": "↯ Generate emojis file",
                    "pt-BR": "↯ Gerar arquivo de emojis",
                }, ck.blue),
                value: "file" 
            },
            { 
                name: uiMessage({
                    "en-US": "✗ Delete emojis",
                    "pt-BR": "✗ Excluir emojis",
                }, ck.red),
                value: "delete" 
            },
            { 
                name: uiMessage({
                    "en-US": "⤷ Select other application",
                    "pt-BR": "⤷ Selecione outra aplicação",
                }, ck.yellow),
                value: "select" 
            },
            {
                name: commonTexts.back,
                value: "back" 
            },
        ]
    }));
    divider();

    switch(action){
        case "list":{
            menus.discord.emojis.list(cli, token);
            return;
        }
        case "upload":{
            menus.discord.emojis.upload(cli, token);
            return;
        }
        case "delete":{
            menus.discord.emojis.delete(cli, token);
            return;
        }
        case "file":{
            menus.discord.emojis.file(cli, token);
            return;
        }
        case "select":{
            await menus.discord.emojis.select(cli);
            return;
        }
        case "back":{
            menus.main(cli);
            return;
        }
    }

}

