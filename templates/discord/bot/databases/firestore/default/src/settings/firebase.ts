import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";

import { ServiceAccount } from "firebase-admin";
import { log } from "#settings";

const firebaseAccountPath = rootTo(process.env.FIREBASE_PATH)

if (!fs.existsSync(firebaseAccountPath)){
    const filename = chalk.yellow(`"${path.basename(firebaseAccountPath)}"`);
    const text = chalk.red(`The ${filename} file was not found in ${__rootname}`);
    log.error(text);
    process.exit(0);
}

const firebaseAccount: ServiceAccount = JSON.parse(
    fs.readFileSync(firebaseAccountPath, { encoding: "utf-8" })
);

export { firebaseAccount };