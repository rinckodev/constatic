import * as clack from "@clack/prompts";
import { handlePrompt } from "#helpers";
import ck from "chalk";

export function pkgManagerPrompt(){
    const options = ["npm", "yarn", "pnpm", "bun",]
    .map(manager => ({
        label: `${ck.green("Yes")} (${manager})`, value: manager
    }));
    options.push({ label: ck.red("No"), value: "no" });

    return handlePrompt(clack.select({
        message: ck.bold("📥 Install dependencies?"),
        options,
    })) satisfies Promise<string>;
}