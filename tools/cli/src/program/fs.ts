import { execSync } from "node:child_process";
import { CopyOptions, Dirent } from "node:fs";
import { access, constants, cp, glob as nodeGlob } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { PackageJson, readPackageJSON, writePackageJSON } from "pkg-types";

interface GlobOptions {
    cwd?: string;
    absolute?: boolean;
    exclude?: string[] | ((fileName: Dirent) => boolean)
    includeDirs?: boolean;
}
export const programFs = Object.freeze({
    async exists(path: string){
        return await access(path, constants.F_OK)
            .then(() => true)
            .catch(() => false);
    },
    async glob(pattern: string | string[], options: GlobOptions = {}){
        const { cwd, absolute=false, exclude, includeDirs=false } = options;
        const base = cwd ?? process.cwd();

        const entries = await Array.fromAsync(
            nodeGlob(pattern, { cwd, exclude, withFileTypes: true })
        );
        const filtered = includeDirs 
            ? entries
            : entries.filter(e => e.isFile());

        const paths = filtered.map(e => {
            const full = e.parentPath
                ? join(e.parentPath, e.name)
                : e.name;
            return relative(base, full);
        });

        return absolute 
            ? paths.map(p => resolve(base, p)) 
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
    },
    async copy(source: string, dist: string, options: CopyOptions = {}){
        return cp(source, dist, {
            recursive: true,
            ...options,
        });
    }
});


function resolvePkgPath(path: string){
    return path.endsWith("package.json")
        ? path : join(path, "package.json");
}