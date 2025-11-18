import { glob } from "node:fs/promises";
import path from "node:path";

export async function loadModules(meta: ImportMeta, modules: string[] = []) {
    const exclude = modules
        .filter(path => path.charAt(0) == "!")
        .map(path => path.slice(1));

    const filepaths = await Array.fromAsync(
        glob(modules, { cwd: meta.dirname, exclude })
    );
    const promises = filepaths.map(filepath =>
        import(path.join(meta.dirname, filepath))
            .then(imported => ({
                module: imported,
                filepath
            }))
    );
    return Promise.all(promises);
}