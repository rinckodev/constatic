import { BotProjectPreset } from "#types";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export async function rewriteEnv(destinationPath: string, env: NonNullable<BotProjectPreset["env"]>){
    const envSchemaPath = path.join(destinationPath, "src/settings/env.ts");
    const envSchemaFile = await readFile(envSchemaPath, "utf-8");
    env.schema = env.schema.replaceAll("\\n", "\n");
    let replaceKey = "// Env vars...";
    await writeFile(envSchemaPath, envSchemaFile.replace(
        replaceKey, [env.schema, "    "+replaceKey].join("\n")
    ));

    const envFilePath = path.join(destinationPath, ".env");
    const envExampleFilePath = path.join(destinationPath, ".env.example");
    const [envFile, envExampleFile] = await Promise.all([
        readFile(envFilePath, "utf-8"), readFile(envExampleFilePath, "utf-8")
    ]);
    env.file = env.file.replaceAll("\\n", "\n");
    replaceKey = "BOT_TOKEN=";

    await Promise.all([
        writeFile(envFilePath, envFile.replace(replaceKey, [replaceKey, env.file].join("\n"))),
        writeFile(envExampleFilePath, envExampleFile.replace(replaceKey, [replaceKey, env.file].join("\n")))
    ]);
}