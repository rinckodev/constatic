import { handlePrompt } from "#helpers";
import * as clack from "@clack/prompts";
import ck from "chalk";

export function actionsPrompt(title: string = ""){
    return handlePrompt(clack.select({
        message: ck.bold(`⤷ Select an action ${title}`),
        options: [
            { label: ck.green("◈ Init discord bot project"), value: "bot-init" },
            { label: ck.blue("☰ Settings"), value: "settings" },
            { label: ck.red("✕ Quit"), value: "quit" },
        ],
    })) satisfies Promise<"bot-init" | "settings" | "quit">;
}