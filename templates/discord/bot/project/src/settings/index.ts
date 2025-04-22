import settings from "../../settings.json" with { type: "json" };
import { envSchema } from "./env.schema.js";

import "./global.js";
import { logger } from "./logger.js";
import { validateEnv } from "./env.validate.js";
export * from "./error.js";

const env = validateEnv(envSchema);

export { settings, logger, env };