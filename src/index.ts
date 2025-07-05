#!/usr/bin/env node
import { cliLang, getPackageManager, initConf, log, uiMessage } from "#helpers";
import { menus } from "#menus";
import ck from "chalk";
import * as citty from "citty";
import path from "node:path";
import { readPackageJSON } from "pkg-types";
import { fileURLToPath } from "url";

const cliroot = import.meta.dirname 
    ? path.join(import.meta.dirname, "..")
    : path.dirname(path.join(fileURLToPath(import.meta.url), ".."));

const packageJson = await readPackageJSON(path.join(cliroot, "package.json"));

const conf = initConf(packageJson.name);

if (process.versions.node < "20.11"){
    log.error(uiMessage({
       "en-US": "Required node version: 20.11 or higher",
       "pt-BR": "Versão do node necessária: 20.11 ou superior",
    }));
    console.log(uiMessage({
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
    meta: {
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
    },
    run() {
        menus.main({
            configdir: path.dirname(conf.path),
            cwd: process.cwd(), cliroot, conf, 
            version: packageJson.version??"0.0.0",
            isBun: getPackageManager() === "bun",
            get lang(){
                return cliLang.get()
            }, 
        });
    },
});