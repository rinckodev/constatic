import { Language } from "#types";
import ck, { ChalkInstance } from "chalk";
import { cliLang } from "./helper.lang.js";
export { setTimeout as sleep } from "node:timers/promises";

export function uiMessage(texts: Record<Language, string>, style?: ChalkInstance) {
    const lang = cliLang.get();
    return style ? style(texts[lang]) : texts[lang];
}

const keys = {
    get tab() {
        return ck.cyan("<tab>");
    },
    get enter() {
        return ck.cyan("<enter>");
    },
    get space() {
        return uiMessage({
            "en-US": ck.cyan("<space>"),
            "pt-BR": ck.cyan("<espaço>"),
        });
    },
    get a() {
        return ck.cyan("<a>");
    }
}

export const instructions = {
    get checkbox() {
        return "\n" + uiMessage({
            "en-US": `Controls: ${keys.space} select/deselect | ${keys.a} select all | ${keys.enter} proceed`,
            "pt-BR": `Controles: ${keys.space} selecionar/deselecionar | ${keys.a} selecionar tudo | ${keys.enter} prosseguir`
        }, ck.dim)
    },
    get searchSelect() {
        const tabKey = ck.cyan("<tab>");
        const enterKey = ck.cyan("<enter>");
        return () => {
            return "\n" + uiMessage({
                "en-US": `Controls: ${tabKey} select/deselect | ${enterKey} proceed`,
                "pt-BR": `Controles: ${tabKey} selecionar/desselecionar | ${enterKey} prosseguir`
            }, ck.dim);
        }
    }
}

export const commonTexts = {
    get back() {
        return uiMessage({
            "en-US": ck.dim(`⤶ Back`),
            "pt-BR": ck.dim(`⤶ Voltar`),
        })
    },
}

export const colors = {
    azoxo: "#5865F2"
};

export function divider() {
    console.log();
}

export const cliTableChars = {
    "top-left": "╭",
    "top-right": "╮",
    "bottom-right": "╯",
    "bottom-left": "╰",
}