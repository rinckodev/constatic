import { handlePrompt } from "#helpers";
import * as clack from "@clack/prompts";
import ck from "chalk";

export function extraFeaturesPrompt(){
    return handlePrompt(clack.multiselect({
        message: `✨ Extra features ${ck.dim("(press space to select)")}`,
        required: false,
        options: [
            { label: "Discloud project", hint: "Host", value: "discloud" },
            { label: "API Server", hint: "Http", value: "server" },
        ],
    })) satisfies Promise<string[]>
}