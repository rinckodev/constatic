import { handlePrompt } from "#helpers";
import { select } from "@clack/prompts";
import ck from "chalk";

export function actionsPrompt(title: string = ""){
    return handlePrompt(select({
        message: ck.bold(`⤷ Select an action ${title}`),
        options: [
            { label: ck.green("◈ Discord bot tokens"), value: "bot-tokens" },
            { label: ck.red("✕ Main menu"), value: "main" },
        ],
    })) satisfies Promise<"bot-tokens" | "main">;
}