import { handlePrompt } from "#helpers"
import { password } from "@clack/prompts";

export function newTokenPrompt(){
    return handlePrompt(password({
        message: "Insert your discord bot token",
        mask: "*"
    }));
}