import { handlePrompt } from "#helpers";
import { BotToken } from "#types";
import * as clack from "@clack/prompts";
import ck from "chalk";

export function tokenPrompt(tokens: BotToken[]){
    if (tokens.length < 1) return -1;
    const options = tokens.map(
        ({ name }, index) => ({
            label: name, value: index
        })
    );
    options.unshift({ label: "None", value: -1 });

    return handlePrompt(clack.select({
        message: ck.bold("🔑 Saved token"),
        options,
    })) satisfies Promise<number>;
}