import fs from "fs-extra";
import path from "node:path";

export async function isEmptyDir(path: string){
    const dir = await fs.readdir(path);
    return dir.length < 1;
}

export function listDirectoryItems(path: string){
    const items = fs.readdirSync(path, { withFileTypes: true })
    const folders = items.filter(item => item.isDirectory());
    const files = items.filter(item => item.isFile());
    return folders.concat(files);
}

interface CopyDirOptions {
    ignoreItems?: string[],
    ignoreExt?: string[]
}
export async function copyDir(src: string, dest: string, options: CopyDirOptions = {}){
    const { ignoreItems, ignoreExt } = options;
    return fs.copy(src, dest, {
        filter(item){
            if (ignoreItems?.includes(path.basename(item))) return false;
            if (ignoreExt?.some(ext => path.basename(item).endsWith(ext))) return false;
            return true;
        }
    })
}