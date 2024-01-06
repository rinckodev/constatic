import fs from "node:fs";
import settings from "./settings.json" with { type: "json" };
import "./global.js";

import dotenv from "dotenv";

const devEnvPath = rootTo(".env.development");
dotenv.config({ path: fs.existsSync(devEnvPath) ? devEnvPath : undefined });

export { consola as log } from "consola";
export { settings };