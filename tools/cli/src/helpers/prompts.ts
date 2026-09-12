import { ck } from "#utils/ck.js";

export const baseTheme = {
    style: {
        help: () => "",
        message: (text: string) => ck.reset(text),
        answer: (text: string) => ck.dim(text),
        renderSelectedChoices: () => "",
    },
    prefix: {
        idle: ck.cyan("◆"),
        done: ck.green("◇")
    },
    icon: {
        cursor: "→"
    }
};

export const theme = {
    ...baseTheme,
    searchSelect: {
        style: baseTheme.style,
        prefix: baseTheme.prefix.done,
        icon: {
            ...baseTheme.icon,
            checked: ck.green("◉"),
            unchecked: "◯"
        }
    }
};