#!/usr/bin/env node
import { showUsage, uiMessage } from "#helpers";
import { ck } from "#utils/ck.js";
import { log } from "#utils/log.js";
import { runMain } from "citty";
// import { CLI } from "./cli/index.txt";
import createMain from "./commands/main.js";

// const cliroot = import.meta.dirname 
//     ? path.join(import.meta.dirname, "..")
//     : path.dirname(path.join(fileURLToPath(import.meta.url), ".."));

const REQ_VERSION = "20.12";

if (process.versions.node < REQ_VERSION){
    log.error(uiMessage({
       "en-US": `Required node version: ${ck.gray(`${REQ_VERSION} or higher`)}`,
       "pt-BR": `Versão do node necessária: ${ck.gray(`${REQ_VERSION} ou superior`)}`,
    }));
    console.log(uiMessage({
       "en-US": `  Your node version: ${ck.gray(process.versions.node)}`,
       "pt-BR": `  A versão do seu node: ${ck.gray(process.versions.node)}`,
    }));
    process.exit(1);
}

// const cli = await CLI.init(cliroot);

runMain(createMain(), { 
    showUsage 
});