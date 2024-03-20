import settingsJson from "./settings.json" with { type: "json" };
export { consola as log } from "consola";
export { onError } from "./error.js";

import "./env.js";
import "./global.js";

export const settings = settingsJson;