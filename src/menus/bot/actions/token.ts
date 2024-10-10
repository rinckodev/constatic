import { BotToken } from "#types";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export async function tokenSetup(distPath: string, { token }: BotToken){
    const envPath = path.join(distPath, ".env");
    const file = await readFile(envPath, "utf-8");
    const content = file.replace("BOT_TOKEN=", `BOT_TOKEN=${token}`);
    await writeFile(envPath, content, "utf-8");
}