#!/usr/bin/env node
import { intro } from "@clack/prompts";
import * as citty from "citty";
import chalk from "chalk";
import path from "node:path";
import { importMeta } from "./helpers/meta";
import { Package } from "./helpers/package";
import { MainMenu } from "./menus/main";

const { __dirname } = importMeta(import.meta);

intro(`💫 ${chalk.blue("Constatic CLI")} 📦 ${chalk.gray.underline(Package.json.version)}`)

const rootname = path.join(__dirname, "..");

citty.runMain({
    meta: {
        name: Package.json.name,
        description: Package.json.description,
        version: Package.json.version
    },
    run() {
        MainMenu({ rootname });
    },
});