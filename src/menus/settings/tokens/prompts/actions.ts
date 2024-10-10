import { handlePrompt } from "#helpers";
import { select } from "@clack/prompts";
import ck from "chalk";

export function actionsPrompt(title: string = ""){
    return handlePrompt(select({
        message: `Select an action ${title}`,
        options: [
            { label: ck.blue("List saved tokens"), value: "list" },
            { label: ck.green("Save new token"), value: "new" },
            { label: ck.red("Delete a token"), value: "delete" },
            { label: ck.red("Back"), value: "back" },
        ]
    })) satisfies Promise<"list" | "new" | "delete" | "back">;
}