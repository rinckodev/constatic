import fs from "node:fs/promises";

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