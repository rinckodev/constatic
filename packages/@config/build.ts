import { $, Glob, type BuildConfig } from "bun";
import { styleText } from "node:util";

export async function build() {
    const entrypoints = await Array.fromAsync(
        new Glob("./src/**/*.ts").scan()
    );

    console.log(entrypoints
        .map(ep => styleText("dim", `└─ ${ep}`))
        .join("\n")
    );
    console.log();

    const preset = {
        entrypoints,
        root: "./src",
        outdir: "dist",
        target: "node",
        splitting: false,
        external: ["*"],
    } satisfies BuildConfig;

    const result = await Bun.build({ ...preset, format: "esm" });
    
    console.log(result.outputs
        .map(({ path }) => {
            const filepath = styleText(["yellowBright"],
                path.replace(process.cwd(), "")
            )

            return `${styleText("green", "ESM")} ${filepath}`
        })
        .join("\n")
    )
    console.log();
    console.log(styleText("green", "✔ The project was compiled successfully!"))

    await $`bun run typegen`.quiet();

    console.log(styleText("blue", "✔ DTS generated successfully!"));
}