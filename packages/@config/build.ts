import { $, Glob } from "bun";
import { styleText } from "node:util";

interface BuildOptions {
    disableTypes?: boolean;
}
export async function build(options: BuildOptions = {}) {
    const entrypoints = await Array.fromAsync(
        new Glob("./src/**/*.ts").scan()
    );

    console.log(entrypoints
        .map(ep => styleText("dim", `└─ ${ep}`))
        .join("\n")
    );
    console.log();

    const result = await Bun.build({ 
        entrypoints,
        root: "./src",
        outdir: "./build",
        target: "node",
        splitting: false,
        external: ["*"],
        format: "esm" 
    });
    
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
    console.log(styleText("green", "✔ Project compiled"))

    if (!(options.disableTypes??false)){
        await $`bun run typegen`.quiet();
        console.log(styleText("blue", "✔ DTS generated successfully!"));
    }
}