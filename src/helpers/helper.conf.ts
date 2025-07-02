import { ConfSchema } from "#types";
import Conf from "conf";
import { cliLang, detectLanguage } from "./helper.lang.js";

export function initConf(name?: string){
    const conf = new Conf<ConfSchema>({
        projectName: name,
        defaults: {
            "discord.bot.tokens": [],
            "presets.scripts": [],
            lang: detectLanguage(),
        }
    })
    cliLang.set(conf.get("lang"));
    return conf;
}