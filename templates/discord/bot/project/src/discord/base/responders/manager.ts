import { addRoute, createRouter, findRoute } from "rou3";
import { GenericResponderData, ResponderType } from "./types.js";
import chalk from "chalk";
import { spaceBuilder } from "@magicyan/discord";

export class ResponderManager {
    private readonly router = createRouter<GenericResponderData>();

    public readonly logs: string[] = [];

    private withLeadingSlash(path: string){
        return path.startsWith("/") ? path : `/${path}`
    };

    public add(data: GenericResponderData){
        const customId = this.withLeadingSlash(data.customId);
        for(const type of new Set(data.types)){
            addRoute(this.router, type, customId, { ...data, customId });
        };
        return data;
    }
    public addLogs(data: GenericResponderData){
        for(const type of new Set(data.types)){
            this.logs.push(chalk.green(spaceBuilder(
                chalk.greenBright(`▸ ${type}`),
                chalk.gray(">"), 
                chalk.underline.blue(data.customId),"✓"
            )));
        };
    }
    public getHandler(type: ResponderType, customId: string){
        return findRoute(this.router, type, this.withLeadingSlash(customId));
    }
}