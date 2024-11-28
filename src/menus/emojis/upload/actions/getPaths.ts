import glob from "fast-glob";
import path from "node:path";

export async function getEmojiPaths(directory: string) {
    return await glob("./**/*.{jpeg,png,gif}", { 
        cwd: path.resolve(directory), 
        absolute: true 
    });
}