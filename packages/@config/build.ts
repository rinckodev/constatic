import { $, Glob, type BuildConfig } from "bun";
import { extname } from "node:path";
import { styleText } from "node:util";

export async function build() {
    const entrypoints = await Array.fromAsync(
        new Glob("./src/**/*.ts").scan()
    );

    console.log(entrypoints
        .map(ep => styleText("dim", `└─ ${ep}`))
        .join("\n")
    );

    const preset = {
        entrypoints,
        root: "./src",
        outdir: "dist",
        target: "node",
        splitting: false,
        external: ["*"],
    } satisfies BuildConfig;

    const results = await Promise.all([
        Bun.build({
            ...preset,
            format: "cjs",
            naming: "[dir]/[name].cjs",
        }),
        Bun.build({ ...preset, format: "esm" }),
    ]);
    
    for (const result of results) {
        console.log(result.outputs
            .map(({ path }) => {
                const isCJS = extname(path) === ".cjs";
                const filepath = styleText(["yellowBright"],
                    path.replace(process.cwd(), "")
                )

                return `${styleText("green", isCJS ? "CJS" : "ESM")} ${filepath}`
            })
            .join("\n")
        )
        console.log();
    }

    console.log(styleText("green", "✔ The project was compiled successfully!"))

    await $`bun run typegen`.quiet();

    console.log(styleText("blue", "✔ DTS generated successfully!"));
}