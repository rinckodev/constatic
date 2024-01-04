#!/usr/bin/env node
import { Command } from "commander";
import { Package } from "./helpers/package";
import { MainMenu } from "./menus/main";
import { intro, log } from "@clack/prompts";
import chalk from "chalk";

const programNodeVersion = "21.5.0";

intro(`💫 ${chalk.blue("Constatic CLI")} 📦 ${chalk.gray.underline(Package.json.version)}`)

if (process.versions.node < programNodeVersion){
    log.error([
        `This program requires Node.js version ${chalk.cyan(programNodeVersion)} or higher`,
        `➝ ${chalk.underline.greenBright("https://nodejs.org/en")}`
    ].join("\n"));
    process.exit(0);
}

const program = new Command()
.name(Package.json.name)
.description(Package.json.description)
.version(Package.json.version)

MainMenu()