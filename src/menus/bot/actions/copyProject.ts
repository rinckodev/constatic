import { copy } from "fs-extra";
import path from "node:path";

export async function copyProject(projectPath: string, distPath: string){
    const items = [
        "node_modules", 
        "package-lock.json", 
        "build", "dist"
    ];
    const extensions = [
        ".env.dev",
        ".env.development",
        ".development.json",
    ]
    await copy(projectPath, distPath, {
        overwrite: true,
        filter(source) {
            const basename = path.basename(source);
            if (items.includes(basename)) return false;
            if (extensions.some(ext => basename.endsWith(ext))) return false;
            return true;
        },
    });
}