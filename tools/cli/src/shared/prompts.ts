import { ck } from "#utils/ck.js";
import { checkbox, confirm, input, number, password, search, select } from "@inquirer/prompts";
import multifilter from "inquirerjs-checkbox-search";

export const theme = Object.freeze({
    style: {
        message: (t: string) => ck.reset(t),
        answer: (t: string) => ck.dim(t),
        renderSelectedChoices: () => "",
    },
    prefix: {
        idle: ck.cyan("◆"),
        done: ck.green("◇")
    },
    icon: {
        cursor: "→"
    }
});
function withTheme<T extends (...args: any[]) => any>(fn: T) {
    return function (config: any) {
        return fn({ ...config, theme })
    } as T
}

export const prompts = {
    input: withTheme(input),
    confirm: withTheme(confirm),
    select: withTheme(select),
    checkbox: withTheme(checkbox),
    password: withTheme(password),
    number: withTheme(number),
    search: withTheme(search),
    multifilter: withTheme(multifilter)
}