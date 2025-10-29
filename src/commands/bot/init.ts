import { actions } from "#actions/index.js";
import { CLI } from "#cli";
import { l } from "#helpers";
import { menus } from "#menus";
import { defineCommand } from "citty";
import path from "node:path";
import { commandFlags } from "../flags.js";

export default function (cli: CLI) {
    return defineCommand({
        meta: {
            name: "init",
            description: l({
                "pt-BR": "Iniciar novo projeto de bot de discord",
                "en-US": "Init a new discord bot project",
            })
        },
        args: {
            database: commandFlags.database,
            server: commandFlags.server,
            tsup: commandFlags.tsup,
            token: commandFlags.token,
            discloud: commandFlags.discloud,
            install: commandFlags.install,
            scripts: {
                type: "string",
                alias: "s",
                description: l({
                    "pt-BR": "Predefinições de scripts do projeto",
                    "en-US": "Project script presets",
                })
            },
            dist: {
                type: "positional",
                required: false,
                description: l({
                    "pt-BR": "Caminho de destino do projeto",
                    "en-US": "Project dist path",
                })
            },
        },
        async run(context) {
            const args = context.args;

            if (context.rawArgs.length < 1) {
                menus.discord.bot(cli);
                return;
            }
            const extras: string[] = [];
            if (args.discloud || args.d) extras.push("discloud");
            if (args.tsup || args.t) extras.push("tsup");

            const dist = path.resolve(args.dist ?? "./");

            const data = {
                dist, extras,
                database: args.database ?? args.db,
                server: args.server ?? args.sv,
                token: args.token ?? args.tk,
                install: args.install ?? args.i,
                scripts: args.scripts
                    ? args.scripts.split(" ")
                    : []
            };

            await actions.bot.init(cli, data);
        },
    })
}