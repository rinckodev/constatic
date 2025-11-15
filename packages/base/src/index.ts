import pkg from "../package.json" with { type: "json" };
export const version = pkg.version;

export * from "./bootstrap.js";
export * from "./creators/index.js";

