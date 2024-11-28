import { handlePrompt } from "#helpers";
import * as clack from "@clack/prompts";

export function confirmPrompt(){
    clack.log.warn([
        "Depending on the amount of files,", 
        "this process may take some time due", 
        "to Discord API rate limitations."
    ].join("\n"))
    return handlePrompt(clack.confirm({
        message: "Do you want to confirm the image files upload process?",
    })); 
}