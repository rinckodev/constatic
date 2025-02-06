#!/usr/bin/env node
import "#helpers";
import ck from "chalk";
import path from "node:path";
import { readPackageJSON } from "pkg-types";
import * as citty from "citty";
import { menus } from "#menus";
import { initConf, log, uiText } from "#helpers";
import lodash from "lodash";
import { fileURLToPath } from "url";

const cliroot = import.meta.dirname 
    ? path.join(import.meta.dirname, "..")
    : path.dirname(path.join(fileURLToPath(import.meta.url), ".."));

const packageJson = await readPackageJSON(path.join(cliroot, "package.json"));

const conf = initConf(packageJson.name);
const lang = conf.get("lang");

if (process.versions.node < "20.11"){
    log.error(uiText(lang, {
       "en-US": "Required node version: 20.11 or higher",
       "pt-BR": "Versão do node necessária: 20.11 ou superior",
    }));
    console.log(uiText(lang, {
       "en-US": `Your node version: ${process.versions.node}`,
       "pt-BR": `A versão do seu node: ${process.versions.node}`,
    }));
    process.exit(1);
}

console.log(
    ck.blue("💎 Constatic CLI"), "📦",
    ck.dim.underline(packageJson.version),
    "\n"
);

citty.runMain({
    meta: lodash.pick(packageJson, ["name", "version", "description"]),
    run() {
        menus.main({ cliroot, conf, lang, cwd: process.cwd() });
    },
});