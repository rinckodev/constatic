import { cp } from "node:fs/promises";
import path from "node:path";

export async function copyProject(projectpath: string, distpath: string) {
    const items = [
        "node_modules", 
        "package-lock.json", 
        "build", "dist",
        "deprecated"
    ];
    const extensions = [
        ".env.dev",
        ".env.development",
        ".development.json",
        ".dev.json",
    ];
    await cp(projectpath, distpath, {
        recursive: true,
        force: true,
        filter(source) {
            const basename = path.basename(source);
            if (items.includes(basename)) return false;
            if (extensions.some(ext => basename.endsWith(ext))) return false;
            return true;
        },
    });
}