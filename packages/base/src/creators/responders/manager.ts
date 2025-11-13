import type { CacheType } from "discord.js";
import { Router } from "../../utils/router.js";
import type { Responder, ResponderType } from "./responder.js";

type GenericResponder = Responder<string, readonly ResponderType[], any, CacheType>;

export class ResponderManager {
    private readonly router = new Router<GenericResponder>();
    public set(responder: GenericResponder) {
        const path = responder.data.customId;
        for(const type of new Set(responder.data.types)){
            this.router.add(type, path, responder);
        }
    }
    public getHandler(type: ResponderType, customId: string){
        return this.router.find(type, customId);
    }
}