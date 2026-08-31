import { styleText } from "node:util";

type Format = Extract<Parameters<typeof styleText>[0], string>;
export type Chalk = ((text: string) => string) & {[K in Format]: Chalk };

const create = (format: Format[]) =>
    new Proxy((text: string) => text, {
        get: (_, prop) => create([...format, prop as Format]),
        apply: (_, __, [text]: [string]) => styleText(format, text)
    }) as Chalk;

export const ck = create([]);