import { ConfSchema, Language } from "#types";
import Conf from "conf";

export function initConf(name?: string){
    return new Conf<ConfSchema>({
        projectName: name,
        defaults: {
            "discord.bot.tokens": [],
            lang: detectLanguage(),
        }
    });
}

function detectLanguage(): Language {
    return (
        process.env.LANG?.startsWith("pt_BR") || 
        process.env.LANG?.startsWith("pt_PT")
    )
    ? "pt-BR" : "en-US";
}