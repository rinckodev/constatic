import type { Language } from "#types";

export function detectLanguage(): Language {
    return (
        process.env.LANG?.startsWith("pt_BR") || 
        process.env.LANG?.startsWith("pt_PT")
    )
    ? "pt-BR" : "en-US";
}

let currentLang: Language = detectLanguage();

export const cliLang = {
    get(){
        return currentLang
    },
    set(lang: Language){
        currentLang = lang;
    }
}

export function l<T>(arg: Record<Language, T>){
    return arg[cliLang.get()];
}