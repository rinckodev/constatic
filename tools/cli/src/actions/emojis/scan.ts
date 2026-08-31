import { program } from "#program";
import { UploadEmojisData } from "#shared/emojis.js";
import { readFile, stat } from "node:fs/promises";
import { basename, extname, resolve } from "node:path";

export async function emojisScanAction(dirpath: string) {
    const paths = await program.fs.glob("**/*.{png,jpeg,gif,webp}", {
        cwd: resolve(dirpath), absolute: true
    });

    const data: UploadEmojisData[] = [];
    
    const promises = await Promise.allSettled(paths.map(async filepath => {
        const stats = await stat(filepath);
        const size = Math.ceil(stats.size / 1024);
        if (size >= 256) return null;

        const ext = extname(filepath);
        const name = basename(filepath, ext);
        const data = await readFile(filepath, { encoding: "base64" });
        const base64 = `data:image/${ext.slice(1)};base64,${data}`;
        const emojiName = name.trim()
            .replaceAll(" ", "_")
            .replaceAll("-", "_")
            .split("_")
            .filter(w => w.length)
            .join("_")
            .toLowerCase();

        return { base64, name: emojiName }
    }));

    for(const p of promises){
        if (p.status !== "fulfilled" || !p.value) continue;
        data.push(p.value);
    }

    return data;
}