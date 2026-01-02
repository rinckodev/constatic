import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export class KeyValueFile {
    private data: Record<string, string | undefined> = {};
    private raw: string = "";
    private filepath?: string;
    constructor(filepath?: string) {
        this.filepath = filepath;
    }
    public set(key: string, value?: string) {
        this.data[key] = value??"";
    }
    public define(data: Record<string, string | undefined>, overwrite?: boolean){
        if (overwrite){
            this.data = data;
            return this;
        }
        this.data = {
            ...this.data,
            ...data
        }
        return this;
    }
    public unset(key: string) {
        this.data[key] = "";
    }
    public delete(key: string) {
        delete this.data[key];
    }
    public get(key: string, fallback?: string) {
        return this.data[key] ?? fallback;
    }
    public async read(path?: string) {
        const filepath = path ?? this.filepath;
        if (!filepath) {
            this.data = {}
            return;
        }
        try {
            this.raw = await readFile(filepath, "utf-8");
        } catch {
            this.raw = "";
        }
        this.data = KeyValueFile.parse(this.raw);
    }
    public static parse(raw: string){
        const data: Record<string, string | undefined> = {}
        const lines = raw.split(/\r?\n/);
        for(const line of lines){
            if (!line || line.charAt(0) === "#" || line.charAt(0) === ";") continue;
            const [key, ...rest] = line.split("=");
            if (!key) continue;
            data[key.trim()] = rest.join("=").trim();
        }
        return data;
    }
    public async write(noValues?: boolean): Promise<void>
    public async write(path?: string, noValues?: boolean): Promise<void>
    public async write(argA?: string | boolean, argB?: boolean): Promise<void> {
        const filepath = typeof argA === "string"
            ? (argA ?? this.filepath)
            : this.filepath;

        const noValues = typeof argA === "boolean" ? argA : argB;
        
        if (!filepath) return;
        await mkdir(dirname(filepath), { recursive: true });
        await writeFile(filepath, this.toString(noValues), "utf-8");
    }
    private toString(noValues: boolean = false): string {
        return Object.entries(this.data)
            .map(([key, value]) => noValues 
                ? `${key}=`
                : `${key}=${value ?? ""}`
            )
            .join("\n");
    }
}