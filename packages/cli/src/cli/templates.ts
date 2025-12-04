import { json } from "#helpers";
import { BotTemplateProperties } from "#types";
import path from "node:path";

export class CLITemplates {
    private botProps!: BotTemplateProperties;
    readonly botPath: string;
    constructor(private rootname: string) {
        this.botPath = path.join(
            this.rootname,
            "templates",
            "discord/bot",
        )
    };
    async load() {
        const propsPath = path.join(this.botPath,"properties.json");
        this.botProps = await json.read<BotTemplateProperties>(propsPath);
    }
    public get bot(): BotTemplateProperties {
        return this.botProps;
    }
}