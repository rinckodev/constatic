import { EnvVarData } from "#types";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export class EnvManager {
    private filepath: string;
    private data: Record<string, string | undefined> = {};
    public get vars(){
        return Object.entries(this.data)
            .reduce((obj, [k, v]) => {
                if (v !== undefined) obj[k] = v;
                return obj;
            }, {} as Record<string, string>)
    }
    constructor(path: string) {
        this.filepath = path;
    }
    async load(): Promise<void> {
        try {
            const content = await readFile(this.filepath, "utf-8");
            const parsed = EnvManager.parse(content);
            this.data = { ...parsed, ...this.data };
        } catch {}
    }
    set(key: string, value?: string) {
        this.data[key] = value ?? "";
    }
    remove(key: string) {
        delete this.data[key];
    }
    unset(key: string) {
        if (this.data[key] !== undefined) {
            this.data[key] = "";
        }
    }
    update([key, _schema, value]: EnvVarData){
        this.set(key, value);
    }
    async save(): Promise<void> {
        await mkdir(dirname(this.filepath), { recursive: true });
        await this.load();
        const content = this.stringify(this.data);
        await writeFile(this.filepath, content, "utf-8");
    }
    async createExample(filePath: string): Promise<void> {
        const exampleData: Record<string, string> = {};
        for (const key of Object.keys(this.data)) {
            exampleData[key] = "";
        }
        const content = this.stringify(exampleData);
        await writeFile(filePath, content, "utf-8");
    }
    public static parse(content: string): Record<string, string> {
        const lines = content.split(/\r?\n/);
        const data: Record<string, string> = {};
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#")) continue;
            const [key, ...rest] = trimmed.split("=");
            const value = rest.join("=");
            data[key] = value || data[key];
        }
        return data;
    }
    private stringify(data: Record<string, string | undefined>): string {
        return Object.entries(data)
            .map(([key, value]) => `${key}=${value ?? ""}`)
            .join("\n");
    }
}
