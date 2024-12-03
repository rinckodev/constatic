import path from "node:path";

export function toNpmName(name: string){
    return name
    .toLowerCase()
    .replaceAll(" ", "-")
    .replaceAll(".", "")
    .replaceAll("/", "")
    .replace(/[^\w\s-]/gi, "");
}

export function getCdPath(filepath: string){
    const basename = path.basename(filepath);
    return basename.trim().includes(" ") 
        ? `cd "./${basename}"` 
        : `cd ./${basename}`
}