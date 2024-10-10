import { handlePrompt } from "#helpers";
import { BotToken } from "#types";
import { select } from "@clack/prompts";
import ck from "chalk";

export function deleteTokenPrompt(tokens: BotToken[]){
    const options = tokens.map(({ name, token }) => ({
        label: name, value: token
    }));
    options.push({ label: ck.red("Back"), value: "back" });
    return handlePrompt(select({
        message: "Select a token", options,
    })) satisfies Promise<string>;
}