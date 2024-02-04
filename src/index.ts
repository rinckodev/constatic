#!/usr/bin/env node
import { intro } from "@clack/prompts";
import * as citty from "citty";
import chalk from "chalk";
import path from "node:path";
import { importMeta } from "./helpers/meta";
import { Package } from "./helpers/package";
import { MainMenu } from "./menus/main";

const { __dirname } = importMeta(import.meta);

async function program() {
    const packageJson = await Package.json();

    intro(`💫 ${chalk.blue("Constatic CLI")} 📦 ${chalk.gray.underline(packageJson.version)}`)

    const rootname = path.join(__dirname, "..");

    citty.runMain({
        meta: {
            name: packageJson.name,
            description: packageJson.description,
            version: packageJson.version
        },
        run() {
            MainMenu({ rootname });
        },
    });
}
program();