import { cliTheme, commonTexts, divider, uiText } from "#helpers";
import { menus } from "#menus";
import { DiscordBotToken, ProgramMenuProps } from "#types";
import { select } from "@inquirer/prompts";
import ck from "chalk";
import { selectDiscordBot } from "./menu-select.js";

export async function discordEmojisMenu(props: ProgramMenuProps, token?: DiscordBotToken){
    if (!token){
        await selectDiscordBot(props);
        return;
    }
    
    const action = await select({
        message: uiText(props.lang, {
            "pt-BR": "❑ Gerenciar emojis",
            "en-US": "❑ Manage emojis",
        }, ck.reset.cyan.underline) +
        ck.green(` 🤖 ${token.name}`),
        theme: cliTheme,
        choices: [
            { 
                name: uiText(props.lang, {
                    "en-US": "☰ List emojis",
                    "pt-BR": "☰ Listar emojis",
                }, ck.blue),
                value: "list" 
            },
            { 
                name: uiText(props.lang, {
                    "en-US": "⇡ Upload emojis",
                    "pt-BR": "⇡ Enviar emojis",
                }, ck.green),
                value: "upload" 
            },
            { 
                name: uiText(props.lang, {
                    "en-US": "⇣ Generate emojis file",
                    "pt-BR": "⇣ Gerar arquivo de emojis",
                }, ck.blue),
                value: "file" 
            },
            { 
                name: uiText(props.lang, {
                    "en-US": "▤ Delete emojis",
                    "pt-BR": "▤ Excluir emojis",
                }, ck.red),
                value: "delete" 
            },
            { 
                name: uiText(props.lang, {
                    "en-US": "⤷ Select other application",
                    "pt-BR": "⤷ Selecione outra aplicação",
                }, ck.yellow),
                value: "select" 
            },
            {
                name: commonTexts(props.lang).back,
                value: "back" 
            },
        ]
    });
    divider();

    switch(action){
        case "list":{
            menus.discord.emojis.list(props, token);
            return;
        }
        case "upload":{
            menus.discord.emojis.upload(props, token);
            return;
        }
        case "delete":{
            menus.discord.emojis.delete(props, token);
            return;
        }
        case "file":{
            menus.discord.emojis.file(props, token);
            return;
        }
        case "select":{
            await menus.discord.emojis.select(props);
            return;
        }
        case "back":{
            menus.main(props);
            return;
        }
    }

}

