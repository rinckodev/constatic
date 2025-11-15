import { glob } from "node:fs/promises";

export async function loadModules(meta: ImportMeta, modules: string[] = []) {
    modules.push("./discord/**/*.{js,ts,jsx,tsx}");

    const filepaths = await Array.fromAsync(
        glob(modules, { cwd: meta.dirname })
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