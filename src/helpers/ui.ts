import { Language } from "#types";
import ck, { ChalkInstance } from "chalk";
export { setTimeout as sleep } from "node:timers/promises";

export function uiText(lang: Language, texts: Record<Language, string>, style?: ChalkInstance){
    return style ? style(texts[lang]) : texts[lang];
}

export function commonTexts(lang: Language){
    return {
        back: uiText(lang, {
            "en-US": ck.red(`⤶ Back`),
            "pt-BR": ck.red(`⤶ Voltar`),
        }),
    }
}

export const colors = {
    azoxo: "#5865F2"
};

export function divider(){
    console.log();
}