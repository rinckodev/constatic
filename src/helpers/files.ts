import { EmojiFileInfo } from "#types";
import fs from "node:fs/promises";
import path from "path";

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

export async function getFileInfo(filePaths: string[]): Promise<EmojiFileInfo[]> {
  const list: EmojiFileInfo[] = [];

  for (const filePath of filePaths) {
    const stats = await fs.stat(filePath);
    const extension = path.extname(filePath);
    const name = path.basename(filePath, extension);

    const data = await fs.readFile(filePath, { encoding: "base64" });
    const base64 = `data:image/${extension.slice(1)};base64,${data}`;

    list.push({
      path: filePath,
      name, extension,
      size: Math.ceil(stats.size / 1024),
      base64,
    });
  }
  return list;
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}