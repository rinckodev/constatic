import { GlobOptions as NodeGlobOptions } from "node:fs";
import { glob as nodeGlob } from "node:fs/promises";
import { resolve } from "node:path";

interface GlobOptions extends Omit<NodeGlobOptions, "withFileTypes"> {
    absolute?: boolean;
}

export async function glob(
    patterns: string | string[], 
    options: GlobOptions = {}
){
    const exclude = Array.isArray(patterns) 
        ? patterns.filter(p => p.charAt(0) === "!")
        : [];
    
    const include = Array.isArray(patterns)
        ? patterns.filter(p => p.charAt(0) !== "!")
        : patterns;

    if (exclude.length >= 1){
        Object.assign(options, { exclude })
    };
    const paths = await Array.fromAsync(nodeGlob(include, options));

    return options.absolute 
        ? paths.map(path => resolve(path))
        : paths;
}