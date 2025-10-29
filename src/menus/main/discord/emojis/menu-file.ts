import { APIEmoji, DiscordBotToken } from "#types";
import { input, select } from "@inquirer/prompts";
import fs from "node:fs/promises";
import { divider, log, sleep, uiMessage, withDefaults } from "#helpers";
import { menus } from "#menus";
import ck from "chalk";
import { CLI } from "#cli";
import { fetchDiscordEmojis } from "#shared/emojis/fetch.js";

export async function discordEmojisFileMenu(cli: CLI, token: DiscordBotToken){
    const emojis = await fetchDiscordEmojis({ cli, token });
    if (!emojis) return;

    const filepath = await input(withDefaults({
        message: uiMessage({
            "en-US": "Emoji file path",
            "pt-BR": "Caminho do arquivo de emojis"
        }),
        default: "emojis.json",
        required: true,
        validate(value) {
            if (!value.endsWith(".json")){
                return uiMessage({
                    "en-US": "The file extension must be .json",
                    "pt-BR": "A extensão do arquivo deve ser .json",
                });
            }
            return true;
        },
    }));
    divider();

    const type = await select(withDefaults({
        message: uiMessage({
            "en-US": "Emoji file type",
            "pt-BR": "Tipo de arquivo de emoji"
        }),
        default: "id",
        choices: [
            {
                name: uiMessage({
                    "en-US": `${ck.green("ID")} → File containing emoji IDs`,
                    "pt-BR": `${ck.green("ID")} → Arquivo contendo os IDs dos emojis`,
                }, ck.gray),
                value: "id",
            },
            {
                name: uiMessage({
                    "en-US": `${ck.green("URL")} → File containing emoji URLs`,
                    "pt-BR": `${ck.green("URL")} → Arquivo contendo as URLs dos emojis`,
                }, ck.gray),
                value: "url",
            },
        ]
    }));

    function toRecord(acc: Record<string, string>, emoji: APIEmoji){
        const value = type === "id"
            ? emoji.id
            : toEmojiURL(emoji.id, emoji.animated)
        return { ...acc, 
            [emoji.name]: value 
        };
    }

    const data = {
        static: emojis.filter(e => !e.animated).reduce(toRecord, {}),
        animated: emojis.filter(e => e.animated).reduce(toRecord, {}),
    };

    divider();
    try {
        const toJson = JSON.stringify(data, null, 2);
        await fs.writeFile(filepath, toJson, "utf-8");
        log.success(uiMessage({
            "en-US": "File written successfully!",
            "pt-BR": "Arquivo escrito com sucesso!",
        }));
    } catch(error){
        log.error(uiMessage({
            "en-US": "An error occurred while trying to write the file!",
            "pt-BR": "Ocorreu um erro ao tentar escrever o arquivo!",
        }));
    }
    divider();

    await sleep(500);
    menus.discord.emojis.main(cli, token);
}

function toEmojiURL(emojiId: string, animated=false){
    const ext = animated ? "gif" : "png";
    return `https://cdn.discordapp.com/emojis/${emojiId}.${ext}`
};