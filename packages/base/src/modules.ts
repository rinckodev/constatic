import { join } from "node:path";
import { glob } from "tinyglobby";

export interface ModuleImported {
    module: any,
    filepath: string;
}

/**
 * Dynamically loads modules using glob patterns, returning each imported module
 * along with its file path.
 */
export async function loadModules(meta: ImportMeta, modules: string[] = []) {
    const ignore = modules
        .filter(path => path.charAt(0) == "!")
        .map(path => path.slice(1));

    const filepaths = await glob(modules, { cwd: meta.dirname, ignore })

    const loadModules: ModuleImported[] = [];

    for(const path of filepaths){
        await import(join(meta.dirname, path))
            .then(imported => loadModules.push({
                module: imported,
                filepath: path
            }));
    }
    return loadModules;
}