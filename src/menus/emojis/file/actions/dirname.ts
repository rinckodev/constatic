import * as clack from "@clack/prompts";
import { handlePrompt } from "#helpers";
import ck from "chalk";
import path from "node:path";

export function filepathPrompt(cwd: string){
    return handlePrompt(clack.text({
        message: ck.bold(`📁 Emojis file path ${ck.dim.underline(`${path.basename(cwd)}/`)}`),
        defaultValue: "emojis.json",
        initialValue: "emojis.json",
        placeholder: "Default is \"emojis.json\"",
        validate(value) {
            if (path.extname(value) !== ".json"){
                return "The path must point to a json file";
            }
            if (!value){
                return "You need to provide the file path."
            }
        },
    })); 
}