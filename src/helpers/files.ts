import fs from "node:fs/promises";

export async function isEmptyDir(path: string){
    const dir = await fs.readdir(path);
    return dir.length < 1;
}