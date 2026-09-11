#!/usr/bin/env node
import { showUsage } from "#helpers";
import { registerCancelHandler } from "#utils/cancel.js";
import { ck } from "#utils/ck.js";
import { log } from "#utils/log.js";
import { runMain } from "citty";
import { mainCommand } from "./commands/main.js";

registerCancelHandler();

const REQ_VERSION = "22.0";

if (process.versions.node < REQ_VERSION){
    log.error(`Required node version: ${ck.gray(`${REQ_VERSION} or higher`)}`);
    console.log(`  Your node version: ${ck.gray(process.versions.node)}`);
    process.exit(1);
}

runMain(mainCommand, { showUsage });