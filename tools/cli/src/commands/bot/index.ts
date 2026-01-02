import { defineCommand } from "citty";
import init from "./init.js";
import { CLI } from "#cli";
import { l } from "#helpers";
import add from "./add.js";

export default function (cli: CLI) {
    return defineCommand({
        meta: {
            name: "bot",
            description: l({
                "pt-BR": "Iniciar e gerenciar projetos de bot de discord",
                "en-US": "Init and manage discord bot projects"
            }),
        },
        subCommands: {
            init: init(cli),
            add: add(cli),
        }
    })
}
