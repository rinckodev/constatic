import * as clack from "@clack/prompts";
import { handlePrompt } from "#helpers";
import ck from "chalk";
import path from "node:path";

export function projectNamePrompt(cwd: string){
    return handlePrompt(clack.text({
        message: ck.bold(`📁 Project name ${ck.dim.underline(`${path.basename(cwd)}/`)}`),
        placeholder: "Use \".\" to create in this directory",
        validate(value) {
            if (!value){
                return "You must specify a name for the project!"
            }
        },
    })); 
}