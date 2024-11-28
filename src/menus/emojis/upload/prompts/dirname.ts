import * as clack from "@clack/prompts";
import { handlePrompt } from "#helpers";
import ck from "chalk";
import path from "node:path";

export function dirnamePrompt(cwd: string){
    return handlePrompt(clack.text({
        message: ck.bold(`📁 Path to emoji image directory ${ck.dim.underline(`${path.basename(cwd)}/`)}`),
        placeholder: "Use \".\" to select this directory",
        validate(value) {
            if (!value){
                return "You need to provide a path to the emoji image directory."
            }
        },
    })); 
}