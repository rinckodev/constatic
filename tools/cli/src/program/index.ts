import { programConfig } from "./config.js";
import { programFs } from "./fs.js";
import { programRuntime } from "./runtime.js";
import { programTemplates } from "./templates.js";

export const program = Object.freeze({
    runtime: programRuntime,
    config: programConfig,
    fs: programFs,
    templates: programTemplates
});