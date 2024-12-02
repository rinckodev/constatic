import { APIEmoji, DiscordBotToken, ProgramMenuProps } from "#types";
import { input } from "@inquirer/prompts";
import { fetchDiscordEmojis } from "./fetch.js";
import fs from "node:fs/promises";
import { cliTheme, log, sleep, uiText } from "#helpers";
import { menus } from "#menus";

export async function discordEmojisFileMenu(props: ProgramMenuProps, token: DiscordBotToken){
    const emojis = await fetchDiscordEmojis(props, token);
    if (!emojis) return;

    const filepath = await input({
        message: uiText(props.lang, {
            "en-US": "Emoji file path",
            "pt-BR": "Caminho do arquivo de emojis"
        }),
        default: "emojis.json",
        theme: cliTheme,
        required: true,
        validate(value) {
            if (!value.endsWith(".json")){
                return uiText(props.lang, {
                    "en-US": "The file extension must be .json",
                    "pt-BR": "A extensão do arquivo deve ser .json",
                });
            }
            return true;
        },
    });

    function toRecord(acc: Record<string, string>, emoji: APIEmoji){
        return { ...acc, [emoji.name]: emoji.id };
    }

    const data = {
        static: emojis.filter(e => !e.animated).reduce(toRecord, {}),
        animated: emojis.filter(e => e.animated).reduce(toRecord, {}),
    };

    try {
        const toJson = JSON.stringify(data, null, 2);
        await fs.writeFile(filepath, toJson, "utf-8");
        log.success(uiText(props.lang, {
            "en-US": "File writtend successfully!",
            "pt-BR": "Arquivo escrito com sucesso!",
        }));
    } catch(error){
        log.error(uiText(props.lang, {
            "en-US": "An error occurred while trying to write the file!",
            "pt-BR": "Ocorreu um erro ao tentar escrever o arquivo!",
        }));
    }

    await sleep(1000);
    menus.discord.emojis.main(props, token);
}