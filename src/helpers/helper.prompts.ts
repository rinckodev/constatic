import ck from "chalk";
import merge from "lodash.merge";

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

export function withDefaults<T>(config: T): T {
    return {
        mask: "*",
        instructions: false,
        ...config,
        theme: merge(theme, (config as { theme: object })?.["theme"]),
    };
}