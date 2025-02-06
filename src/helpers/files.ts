import fs from "node:fs/promises";
// import path from "path";

export const json = {
    async read<T = any>(path: string): Promise<T> {
        const stringfiedJson = await fs.readFile(path, "utf-8");
        return JSON.parse(stringfiedJson);       
    },
    async write<T = any>(path: string, data: T){
        const stringfiedJson = JSON.stringify(data, null, 2);
        fs.writeFile(path, stringfiedJson, "utf-8");
    }
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}