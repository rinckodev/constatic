import { glob, mkdir, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative } from "node:path";

export interface ModuleImported {
    module: any,
    filepath: string;
}

/**
 * Dynamically loads modules using glob patterns, returning each imported module
 * along with its file path.
 */
export async function loadModules(meta: ImportMeta, modules: string[] = []) {
    const exclude = modules
        .filter(path => path.charAt(0) == "!")
        .map(path => path.slice(1));

    const filepaths = await Array.fromAsync(
        glob(modules, { cwd: meta.dirname, exclude })
    );

    const loadedModules: ModuleImported[] = [];

    for(const path of filepaths){
        await import("file://"+join(meta.dirname, path))
            .then(imported => loadedModules.push({
                module: imported,
                filepath: path
            }));
    }
    return loadedModules;
}

export async function generateImportsFile(
    meta: ImportMeta,
    path: string,
    imports: ModuleImported[]
){
    const dir = dirname(path);

    const content = imports
        .map(({ filepath }) => {
            const modulePath = join(meta.dirname, filepath);
            let relativePath = relative(dir, modulePath);

            if (!relativePath.startsWith(".")){
                relativePath = `./${relativePath}`;
            }
            relativePath = relativePath
                .replaceAll("\\", "/")
                .replace(new RegExp(`${extname(relativePath)}$`), ".js");
            return `import "${relativePath}";`
        })
        .join("\n");

    await mkdir(dir, { recursive: true });
    await writeFile(path, content, "utf-8");
}