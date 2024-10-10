import path from "node:path";

export function getDist(projectPath: string, cwd: string){
    const distPath = path.resolve(projectPath);
    const isDistRoot = distPath === cwd
    return { distPath, isDistRoot };
}