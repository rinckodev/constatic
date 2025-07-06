import path from "node:path";
import { fileExists } from "./helper.files.js";
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


export interface EnvEditor {
  set(key: string, value: string): void;
  remove(key: string): void;
  save(): Promise<void>;
}

export async function createEnvEditor(filePath: string): Promise<EnvEditor> {
  const env: Record<string, string> = {};
  const originalLines: string[] = [];

  if (await fileExists(filePath).catch(() => false)) {
    const content = await fs.readFile(filePath, "utf-8")
      .catch(() => "");

    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        originalLines.push(line);
        continue;
      }

      const [key, ...rest] = trimmed.split("=");
      env[key] = rest.join("=").trim();
      originalLines.push(line);
    }
  }

  return {
    set(key, value) {
      env[key] = value;
    },

    remove(key) {
      delete env[key];
    },

    async save() {
      const updatedKeys = new Set(Object.keys(env));
      const finalLines: string[] = [];

      for (const line of originalLines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) {
          finalLines.push(line);
          continue;
        }

        const [key] = trimmed.split("=");
        if (env[key] !== undefined) {
          finalLines.push(`${key}=${env[key]}`);
          updatedKeys.delete(key);
        }
      }

      for (const key of updatedKeys) {
        finalLines.push(`${key}=${env[key]}`);
      }

      await fs.writeFile(filePath, finalLines.join("\n") + "\n", "utf-8");

      const examplePath = path.join(path.dirname(filePath), ".env.example");
      const exampleLines = Object.keys(env).map((key) => `${key}=`);
      await fs.writeFile(examplePath, exampleLines.join("\n") + "\n", "utf-8");
    },
  };
}
