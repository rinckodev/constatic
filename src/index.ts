#!/usr/bin/env node
import { intro, log } from "@clack/prompts";
import chalk from "chalk";
import { runMain } from "citty";
import path from "node:path";
import { importMeta } from "./helpers/meta";
import { Package } from "./helpers/package";
import { MainMenu } from "./menus/main";

const { __dirname } = importMeta(import.meta);

const programNodeVersion = "21.5.0";

intro(`💫 ${chalk.blue("Constatic CLI")} 📦 ${chalk.gray.underline(Package.json.version)}`)

if (process.versions.node < programNodeVersion){
    log.error([
        `This program requires Node.js version ${chalk.cyan(programNodeVersion)} or higher`,
        `➝ ${chalk.underline.greenBright("https://nodejs.org/en")}`
    ].join("\n"));
    process.exit(0);
}

const rootname = path.join(__dirname, "..");

runMain({
    meta: {
        name: Package.json.name,
        description: Package.json.description,
        version: Package.json.version
    },
    run() {
        MainMenu({ rootname });
    },
});