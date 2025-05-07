import { DeepPartial, Language } from "#types";
import type { Theme } from "@inquirer/core";
import ck, { ChalkInstance } from "chalk";
export { setTimeout as sleep } from "node:timers/promises";

export function uiText(lang: Language, texts: Record<Language, string>, style?: ChalkInstance){
    return style ? style(texts[lang]) : texts[lang];
}

export function commonTexts(lang: Language){
    return {
        back: uiText(lang, {
            "en-US": ck.dim(`⤶ Back`),
            "pt-BR": ck.dim(`⤶ Voltar`),
        }),
        instructions: uiText(lang, {
            "en-US": ck.reset.dim(`(Press ${ck.cyan("<space>")} to select, ${ck.cyan("<a>")} to select all and ${ck.cyan("<enter>")} to proceed)`),
            "pt-BR": ck.reset.dim(`(Pressione ${ck.cyan("<espaço>")} para selecionar, ${ck.cyan("<a>")} para selecionar tudo e ${ck.cyan("<enter>")} para proceder)`)
        })
    }
}

export const colors = {
    azoxo: "#5865F2"
};

export function divider(){
    console.log();
}

export const cliTheme = {
    style: {
        help: () => "",
        message: (text: string) => ck.reset(text),
        answer: (text: string) => ck.dim(text),
    },
    prefix: {
        idle: ck.cyan("◆"),
        done: ck.green("◇")
    },
    icon: { 
        cursor: "→" 
    }
} as DeepPartial<Theme>;

export const cliTableChars = {
    "top-left": "╭",
    "top-right": "╮",
    "bottom-right": "╯",
    "bottom-left": "╰",
}