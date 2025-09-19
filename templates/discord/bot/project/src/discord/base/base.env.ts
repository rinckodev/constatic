import ck from "chalk";
import { z, ZodObject, ZodRawShape } from "zod";
import { brBuilder } from "@magicyan/discord";
import chalk from "chalk";

const x = chalk.red("✖︎");
const w = chalk.yellow("▲");

export function validateEnv<T extends ZodRawShape>(schema: ZodObject<T>){
    const result = schema.loose().safeParse(process.env);
    if (!result.success){
        const u = ck.underline;
        for(const error of result.error.issues){
            const { path, message } = error;
            console.error(`${x} ENV VAR → ${u.bold(path)} ${message}`);
            if (error.code == "invalid_type")
                console.log(ck.dim(
                    `└ "Expected: ${u.green(error.expected)} | Received: ${u.red(error.input)}`
                ));
        }
        console.log();
        console.warn(brBuilder(
            `${w} Some ${ck.magenta("environment variables")} are undefined.`,
            `  Here are some ways to avoid these errors:`,
            `- Run the project using ${u.bold("./package.json")} scripts that include the ${ck.blue("--env-file")} flag.`,
            `- Inject the ${u("variables")} into the environment manually or through a tool`,
            "",
            chalk.blue(
                `↗ ${chalk.underline("https://constatic-docs.vercel.app/docs/discord/conventions/env")}`
            ),
            ""
        ));
        process.exit(1);
    }
    console.log(ck.green(`${ck.magenta("☰ Environment variables")} loaded ✓`));

    return result.data as Record<string, string> & z.infer<typeof schema>;
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            "Use import { env } from \"#settings\"": never
        }
    }
}