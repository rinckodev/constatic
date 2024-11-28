import { handlePrompt } from "#helpers";
import { select } from "@clack/prompts";
import ck from "chalk";

export function actionsPrompt(title: string = ""){
    return handlePrompt(select({
        message: ck.bold(`⤷ Select an action ${title}`),
        options: [
            { label: ck.blue("☰ List emojis"), value: "list" },
            { label: ck.green("⇡ Upload emojis"), value: "upload" },
            { label: ck.blue("⇣ Gen emojis file"), value: "file" },
            { label: ck.red("▤ Delete all emojis"), value: "delete" },
            { label: ck.yellow("⤷ Select other application"), value: "select" },
            { label: ck.red("✕ Main menu"), value: "main" },
        ],
    })) satisfies Promise<"list" | "upload" | "delete" | "select" | "file" | "main">;
}