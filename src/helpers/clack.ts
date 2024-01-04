import { isCancel, outro } from "@clack/prompts";

export function checkCancel<T>(value: T, message?: string) {
    if (isCancel(value)){
        outro(message ?? "👋 Discord: http://discord.gg/tTu8dGN");
        process.exit();
    }
}