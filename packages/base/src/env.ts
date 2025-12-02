import { format, styleText } from "node:util";
import type { StandardSchemaV1 } from "./utils/schema.js";

type Schema = StandardSchemaV1;
type Out<T extends Schema> = StandardSchemaV1.InferOutput<T>;

/**
 * Validates the current process environment variables using a StandardSchema.
 *
 * This function executes the schema validation against `process.env`
 * and ensures all required environment variables follow the expected shape.
 * @example
 * // "env.ts" — Using Zod
 * import { z } from "zod";
 * import { validateEnv } from "@constatic/base";
 *
 * export const env = await validateEnv(z.object({
 *     BOT_TOKEN: z.string("BOT_TOKEN is required").min(1)
 * }).passthrough());
 *
 * @example
 * // "env.ts" — Using ArkType
 * import { type } from "arktype";
 * import { validateEnv } from "@constatic/base";
 *
 * export const env = await validateEnv(type({
 *     BOT_TOKEN: "string > 0"
 * }));
 */
export async function validateEnv<T extends Schema>(schema: T): Promise<Out<T>> {
    const result = await schema["~standard"].validate(process.env);
    if (result.issues) {
        console.log(
            result.issues.map(issue => format(
                styleText("red", "✖︎ ENV VAR %s ➜ %s"),
                styleText("bold", issue.path?.join(".") ?? ""),
                styleText("gray", issue.message)
            )).join("\n")
        );
        process.exit(1);
    }
    console.log(styleText("dim",
        "☰ Environment variables validated ✓"
    ));
    return result.value;
}
