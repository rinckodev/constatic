#!/usr/bin/env node
import { intro, log } from "@clack/prompts";
import * as citty from "citty";
import chalk from "chalk";
import path from "node:path";
import { Package } from "./helpers/package.js";
import Conf from "conf";
import { menus } from "./menus/index.js";

if (process.versions.node < "20.11"){
    log.error("Required node version: 20.11 or higher");
    console.log(`Your node version: ${process.versions.node}`)
    process.exit(1);
}

const __dirname = import.meta.dirname;

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
                    const projectName = context.args.projectName;
                    menus.discordbot.init({ rootname, projectName, conf })
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
            menus.program.main({ rootname, conf });
        },
    });
}
program();