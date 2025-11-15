import { glob } from "node:fs/promises";

export async function loadModules(meta: ImportMeta, modules: string[] = []) {
    const exclude = modules
        .filter(path => path.startsWith("!"))
        .map(path => path.slice(1));

    const filepaths = await Array.fromAsync(
        glob(modules, { cwd: meta.dirname, exclude })
    );
    const promises = filepaths.map(filepath =>
        import(meta.resolve(filepath))
            .then(imported => ({
                module: imported,
                filepath
            }))
    );
    return Promise.all(promises);
}