#!/usr/bin/env node
import path from "node:path";
import { log } from "@clack/prompts";
import Conf from "conf";
import { readPackageJSON } from "pkg-types";
import * as citty from "citty";
import * as clack from "@clack/prompts";
import ck from "chalk";
import lodash from "lodash";
import { menus } from "#menus";

if (process.versions.node < "20.11"){
    log.error("Required node version: 20.11 or higher");
    console.log(`Your node version: ${process.versions.node}`);
    process.exit(1);
}

const cliroot = path.join(import.meta.dirname, "..");
const packageJson = await readPackageJSON(path.join(cliroot, "package.json"));

const conf = new Conf({ projectName: packageJson.name });

clack.intro(`💎 ${ck.blue("Constatic CLI")} 📦 ${ck.dim.underline(packageJson.version)}`);

citty.runMain({
    meta: lodash.pick(packageJson, ["name", "version", "description"]),
    run() {
        menus.main({ cliroot, conf, cwd: process.cwd() });
    },
});