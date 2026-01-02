import { select as searchSelectPro } from "inquirer-select-pro";
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

function wrapWithCustomError<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  createError: (originalError: unknown, args: TArgs) => Error
): (...args: TArgs) => Promise<TResult> {
  return async (...args: TArgs): Promise<TResult> => {
    try {
      return await fn(...args);
    } catch (err) {
      throw createError(err, args);
    }
  };
}

class ExitPromptError extends Error {
    constructor() {
        super();
        this.name = "ExitPromptError";
    }
}

export const searchSelect = wrapWithCustomError(
    searchSelectPro, () => new ExitPromptError()
);