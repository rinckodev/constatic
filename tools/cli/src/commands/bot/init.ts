import { actions } from "#actions/index.js";
import { menus } from "#menus";
import { defineCommand } from "citty";
import path from "node:path";
import { commandFlags } from "./args.js";

export const initCommand = defineCommand({
    meta: {
        name: "init",
        description: "Init a new discord bot project",
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
            description: "Project script presets"
        },
        dist: {
            type: "positional",
            required: false,
            description: "Project dist path"
        },
    },
    async run(context) {
        const args = context.args;

        if (context.rawArgs.length < 1) {
            await menus.discord.bot();
            return;
        }
        const extras: string[] = [];
        if (args.discloud || args.d) extras.push("discloud");
        if (args.tsup || args.t) extras.push("tsup");

        const dist = path.resolve(args.dist ?? "./");

        const data = {
            dist, extras,
            database: args.database ?? args.db,
            server: args.server,
            token: args.token,
            install: args.install ?? args.i,
            scripts: args.scripts
                ? args.scripts.split(" ")
                : []
        };

        await actions.bot.init(data);
    },
});