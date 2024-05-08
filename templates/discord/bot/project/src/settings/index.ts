import settingsJson from "../../settings.json" with { type: "json" };
import { envSchema, type EnvSchema } from "./env.js";
import { consola as log } from "consola";
export { onError } from "./error.js";

import "./global.js";
import chalk from "chalk";
import { brBuilder } from "@magicyan/discord";

export { log, settingsJson as settings };

if (!process.execArgv.includes("--env-file")){
    log.warn(chalk.yellow("The executed script does not contain the --env-file flag"));
}

const parseResult = envSchema.safeParse(process.env);
if (!parseResult.success){
    for(const { message, path } of parseResult.error.errors){
        log.error({
            type: "ENV VAR",
            message: chalk.red(`${chalk.bold(path)} ${message}`)
        });
    }
    log.fatal(chalk.red(brBuilder(
        "Environment variables are undefined or the env file was not loaded.",
        "Make sure to run the bot using package.json scripts"
    )));
    process.exit(1);
}
log.success(chalk.hex(settingsJson.colors.bravery)("Env vars loaded successfully!"));

declare global {
    namespace NodeJS {
        interface ProcessEnv extends Readonly<EnvSchema> {}
    }
}