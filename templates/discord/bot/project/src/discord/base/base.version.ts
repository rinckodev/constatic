import { env } from "#env";
import ck from "chalk";

declare const Bun: { version: string };
const isBun = typeof Bun !== "undefined";

env.BASE_VERSION = "{{baseVersion}}" as const; // DO NOT CHANGE THIS VAR
const RUNTIME_VERSION = isBun ? Bun.version : process.versions.node; 

const engineName = isBun
    ? `${ck.hex("#F9F1E1")("◌ Bun")}`
    : `${ck.hex("#54A044")("⬢ Node.js")}`;

export const runtimeDisplay = `${engineName} ${ck.reset.dim(RUNTIME_VERSION)}`