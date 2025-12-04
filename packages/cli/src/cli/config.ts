import { cliLang, detectLanguage, equalsIgnoringCase } from "#helpers";
import { ConfSchema } from "#types";
import Conf from "conf";
import path from "node:path";

export class CLIConfig extends Conf<ConfSchema> {
    public static init(name?: string){
        const conf = new this({
            projectName: name,
            defaults: {
                "discord.bot.tokens": [],
                "presets.scripts": [],
                lang: detectLanguage(),
            },
        })
        cliLang.set(conf.get("lang"));
        return conf;
    }
    public get dirname(){
        return path.dirname(this.path);
    }
    public getToken(name: string){
        return this.get("discord.bot.tokens", []).find(t => equalsIgnoringCase(t.name, name));
    }
}