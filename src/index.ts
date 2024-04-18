#!/usr/bin/env node
import { intro } from "@clack/prompts";
import * as citty from "citty";
import chalk from "chalk";
import path from "node:path";
import { importMeta } from "./helpers/meta.js";
import { Package } from "./helpers/package.js";
import { mainMenu } from "./menus/main.js";
import { discordBotInitMenu } from "./menus/discordbot/main.js";
import Conf from "conf";

const { __dirname } = importMeta(import.meta);

async function program() {
    const rootname = path.join(__dirname, "..");
    const packageJson = await Package.json(path.join(rootname, "package.json"));
    const conf = new Conf({ projectName: packageJson.name });

    citty.runMain({
        async setup() {
            intro(`💫 ${chalk.blue("Constatic CLI")} 📦 ${chalk.gray.underline(packageJson.version)}`)
        },
        subCommands: {
            discordbot: {
                meta: {
                    name: "Discord Bot",
                    description: "Init a discord bot project",
                },
                args: {
                    projectName: {
                        type: "positional",
                        required: false,
                        description: "Project directory or name"
                    }
                },
                run(context) {
                    discordBotInitMenu({
                        rootname,
                        projectName: context.args.projectName,
                        conf
                    })
                },
            }
        },
        meta: {
            name: packageJson.name,
            description: packageJson.description,
            version: packageJson.version
        },
        run(context) {
            if (context.rawArgs.length) return;
            mainMenu({ rootname, conf });
        },
    });
}
program();