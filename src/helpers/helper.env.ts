import * as fs from "node:fs/promises";

export async function parseEnvFile(filePath: string) {
  const content = await fs.readFile(filePath, "utf8");
  const lines = content.split(/\r?\n/);

  const envVars: Record<string, string> = {};

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) continue;

    const [key, ...rest] = trimmed.split("=");
    const value = rest.join("=").trim().replace(/^['"]|['"]$/g, "");

    envVars[key.trim()] = value;
  }

  return envVars;
}
