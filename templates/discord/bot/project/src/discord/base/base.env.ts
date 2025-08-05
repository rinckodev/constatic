import ck from "chalk";
import { z, ZodObject, ZodRawShape } from "zod";
import { logger } from "./base.logger.js";
import { brBuilder } from "@magicyan/discord";

export function validateEnv<T extends ZodRawShape>(schema: ZodObject<T>){
    const result = schema.loose().safeParse(process.env);
    if (!result.success){
        const u = ck.underline;
        for(const error of result.error.issues){
            const { path, message } = error;
            logger.error(`ENV VAR → ${u.bold(path)} ${message}`);
            if (error.code == "invalid_type")
                logger.log(ck.dim(
                    `└ "Expected: ${u.green(error.expected)} | Received: ${u.red(error.input)}`
                ));
        }
        logger.log();
        logger.warn(brBuilder(
            `Some ${ck.magenta("environment variables")} are undefined.`,
            `  Below are some ways to avoid these errors:`,
            `- Run the project with ${u.bold("./package.json")} scripts that contain the ${ck.blue("--env-file")} flag. `,
            `- Inject the ${u("variables")} into the environment in some way`
        ));
        process.exit(1);
    }
    logger.log(ck.green(`${ck.magenta("☰ Environment variables")} loaded ✓`));

    return result.data as Record<string, string> & z.infer<typeof schema>;
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            "Use import { env } from \"#settings\"": never
        }
    }
}