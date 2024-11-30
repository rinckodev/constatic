#!/usr/bin/env node
import "#helpers";
import ck from "chalk";
import path from "node:path";
import { readPackageJSON } from "pkg-types";
import * as utils from "moderndash";
import { runMain } from "citty";
import { menus } from "#menus";
import { initConf } from "#helpers";

const cliroot = path.join(import.meta.dirname, "..");
const packageJson = await readPackageJSON(path.join(cliroot, "package.json"));

const conf = initConf(packageJson.name);

console.log(
    ck.blue("💎 Constatic CLI"), "📦",
    ck.dim.underline(packageJson.version),
    "\n"
);

runMain({
    meta: utils.pick(packageJson, ["name", "version", "description"]),
    run() {
        menus.main({ 
            cliroot, conf,
            lang: conf.get("lang"), 
            cwd: process.cwd()
        });
    },
});