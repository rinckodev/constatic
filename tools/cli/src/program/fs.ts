import { execSync } from "node:child_process";
import { access, constants, glob as nodeGlob } from "node:fs/promises";
import { join, resolve } from "node:path";
import { PackageJson, readPackageJSON, writePackageJSON } from "pkg-types";
import { programRuntime } from "./runtime.js";

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
                : nodeGlob(pattern, options)
        );
        return (!programRuntime.isBun() && options.absolute)
            ? paths.map(p => resolve(p))
            : paths; 
    },
    isRepoDirty(cwd?: string) {
        try {
            let stdout = execSync("git status --porcelain", { 
                encoding: "utf-8", cwd, stdio: "pipe" 
            });
            return stdout.trim() !== ""
        } catch (error) {
            if (error?.toString?.().includes("not a git repository")) {
                return false
            }
            return true
        }
    },
    async readPkgJson(path: string) {
        const resolved = resolvePkgPath(path);

        const exists = await this.exists(resolved);
        if (!exists) return null;

        try {
            return await readPackageJSON(resolved) ?? null;
        } catch {
            return null;
        }
    },
    async writePkgJson(path: string, pkg: PackageJson) {
        const resolved = resolvePkgPath(path);
        await writePackageJSON(resolved, pkg);
    }
});


function resolvePkgPath(path: string){
    return path.endsWith("package.json")
        ? path : join(path, "package.json");
}