import { handlePrompt } from "#helpers";
import * as clack from "@clack/prompts";
import ck from "chalk";

export function overwriteMethod(){
    return handlePrompt(clack.select({
        message: ck.bold(`⤷ Select an overwrite mode`),
        options: [
            { label: ck.green("✍️ Overwrite if exists"), value: "all" },
            { label: ck.blue("❔ Ask before overwriting"), value: "ask" },
            { label: ck.blue("🔏 Skip and do not overwrite"), value: "skip" },
        ],
    })) satisfies Promise<"all" | "ask" |"skip">;
}