import settingsJson from "./settings.json" with { type: "json" };
import { envSchema, EnvSchema } from "./env.js";
import { consola as log } from "consola";
export { onError } from "./error.js";

import "./global.js";
import chalk from "chalk";

export { log, settingsJson as settings };

const parseResult = envSchema.safeParse(process.env);
if (!parseResult.success){
    throw parseResult.error;
}
log.success(chalk.hex(settingsJson.colors.bravery)("Env vars loaded successfully!"));


declare global {
    namespace NodeJS {
        interface ProcessEnv extends Readonly<EnvSchema> {}
    }
}