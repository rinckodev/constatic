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
    ignore?: {
        items?: string[];
        extensions?: string[];
    }
}
export async function copyDir(src: string, dest: string, options: CopyDirOptions = {}){
    const { items, extensions } = options.ignore ?? {};
    return fs.copy(src, dest, {
        filter(item){
            if (items?.includes(path.basename(item))) return false;
            if (extensions?.some(ext => path.basename(item).endsWith(ext))) return false;
            return true;
        }
    })
}