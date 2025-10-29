import constants from "node:constants";
import { access } from "node:fs/promises";
import { join } from "node:path";
import { PackageJson, readPackageJSON, writePackageJSON } from "pkg-types";

export class CLIFileSystem {
    constructor() { }
    private resolvePkgPath(path: string){
        return path.endsWith("package.json")
            ? path : join(path, "package.json");
    }
    public async readPkgJson(path: string) {
        const resolved = this.resolvePkgPath(path);

        const exists = await this.exists(resolved);
        if (!exists) return null;

        try {
            return await readPackageJSON(resolved) ?? null;
        } catch {
            return null;
        }
    }
    public async writePkgJson(path: string, pkg: PackageJson) {
        const resolved = this.resolvePkgPath(path);
        await writePackageJSON(resolved, pkg);
    }
    public async exists(path: string) {
        try {
            await access(path, constants.F_OK)
            return true
        } catch {
            return false
        }
    }
}