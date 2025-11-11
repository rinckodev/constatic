import { glob } from "node:fs/promises";
import { createClient } from "./client.js";
import { ConstaticError } from "./error.js";

export interface BootstrapOptions {
    token?: string;
    meta: ImportMeta;
    beforeLoad?(): void;
    modules?: string[];
}

export async function bootstrap(options: BootstrapOptions) {
    const token = options.token ?? process.env.BOT_TOKEN;

    if (!token) throw new ConstaticError(
        "The application token was not provided!"
    );

    const client = createClient(token, {
        intents: []
    });

    const modules = [
        ...options.modules??[],
        "./discord/**/*.{js,ts,jsx,tsx}"
    ];

    const filepaths = await Array.fromAsync(
        glob(modules, { cwd: options.meta.dirname })
    );
    
    await Promise.all(
        filepaths.map(filepath => import(
            options.meta.resolve(filepath)
        ))
    );
    return { client };
}