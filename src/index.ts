#!/usr/bin/env node
import { intro } from "@clack/prompts";
import * as citty from "citty";
import chalk from "chalk";
import path from "node:path";
import { importMeta } from "./helpers/meta";
import { Package } from "./helpers/package";
import { MainMenu } from "./menus/main";
import { DiscordBotMenu } from "./menus/discordbot";

const { __dirname } = importMeta(import.meta);

async function program() {
    const rootname = path.join(__dirname, "..");
    const packageJson = await Package.json(path.join(rootname, "package.json"));

    citty.runMain({
        setup() {
            intro(`💫 ${chalk.blue("Constatic CLI")} 📦 ${chalk.gray.underline(packageJson.version)}`)
        },
        subCommands: {
            discordbot: {
                meta: {
                    name: "discordbot",
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
                    DiscordBotMenu({
                        rootname,
                        projectName: context.args.projectName
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
            MainMenu({ rootname });
        },
    });
}
program();