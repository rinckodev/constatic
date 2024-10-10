import { handlePrompt } from "#helpers";
import { BotAPIServerPreset } from "#types";
import * as clack from "@clack/prompts";
import ck from "chalk";

export function apiServerPrompt(extras: string[], presets: BotAPIServerPreset[]) {
    if (!extras.includes("server")) return -1;

    const options = presets
    .filter(preset => preset.disabled !== true)
    .map(({ icon, name, hint }, index) => ({
        label: `${icon} ${name} ${ck.dim(`(${hint})`)}`,
        value: index,
    }));
    options.unshift({ label: "None", value: -1 });

    return handlePrompt(clack.select({
        message: `🌐 API Server framework`,
        options,
    })) satisfies Promise<number>;
}