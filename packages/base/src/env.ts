import type { StandardSchemaV1 } from "@standard-schema/spec";
import { format, styleText } from "node:util";

type Schema = StandardSchemaV1;
type Out<T extends Schema> = StandardSchemaV1.InferOutput<T>;

export async function validateEnv<T extends Schema>(schema: T): Promise<Out<T>> {
    const result = await schema["~standard"].validate(process.env);
    if (result.issues) {
        const a = result.issues.map(issue => {
            return format(
                styleText("red", "✖︎ ENV VAR %s ➜ %s"),
                styleText("bold", issue.path?.join(".") ?? ""),
                styleText("gray", issue.message)
            )
        });
        console.log(a.join("\n"));
        process.exit(1);
    }
    console.log(styleText(
        "dim", "☰ Environment variables validated ✓"
    ));
    return result.value;
}
