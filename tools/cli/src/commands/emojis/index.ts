import { defineCommand } from "citty";
import { CLI } from "#cli";
import { l } from "#helpers";
import list from "./list.js";

export default function (cli: CLI) {
    return defineCommand({
        meta: {
            name: "emojis",
            description: l({
                "pt-BR": "Gerenciar emojis da aplicação do discord",
                "en-US": "Manage discord application emojis"
            }),
        },
        subCommands: {
            list: list(cli)
        }
    })
}
