import { programConfig } from "./config.js";
import { programFs } from "./fs.js";
import { programRuntime } from "./runtime.js";

export const program = Object.freeze({
    runtime: programRuntime,
    config: programConfig,
    fs: programFs
});