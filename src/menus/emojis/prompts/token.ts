import { handlePrompt } from "#helpers";
import { BotToken } from "#types";
import * as clack from "@clack/prompts";
import ck from "chalk";

export function tokenPrompt(tokens: BotToken[]){
    const options = tokens.map(
        ({ name }, index) => ({
            label: ck.green(name), value: index
        })
    );
    options.push({ label: ck.red("✕ Main menu"), value: -1 });
    return handlePrompt(clack.select({
        message: ck.bold("🤖 Select an application"),
        options,
    })) satisfies Promise<number>;
}