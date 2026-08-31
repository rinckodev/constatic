import { access, constants, glob } from "node:fs/promises";
import { programRuntime } from "./runtime.js";
import { resolve } from "node:path";

interface GlobOptions {
    cwd?: string;
    absolute?: boolean;
}
export const programFs = Object.freeze({
    async exists(path: string){
        return await access(path, constants.F_OK)
            .then(() => true)
            .catch(() => false);
    },
    async glob(pattern: string, options: GlobOptions = {}){
        const paths = await Array.fromAsync(
            programRuntime.isBun()
                ? new Bun.Glob(pattern).scan(options)
                : glob(pattern, options)
        );
        return (!programRuntime.isBun() && options.absolute)
            ? paths.map(p => resolve(p))
            : paths; 
    }
})