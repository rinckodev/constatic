import type { AnySelectMenuInteraction, ButtonInteraction, CacheType, ChannelSelectMenuInteraction, MentionableSelectMenuInteraction, MessageComponentInteraction, ModalMessageModalSubmitInteraction, ModalSubmitInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from "discord.js";
import { createRouter, type MatchedRoute, type RadixRouter } from "radix3";
import { spaceBuilder } from "@magicyan/discord";
import ck from "chalk";
import { isPromise } from "node:util/types";
import { log } from "#settings";

interface ResponderHandlerOptions {
    onNotFound?(interaction: ResponderInteraction<ResponderType, CacheType>): void;
}
export enum ResponderType {
    Button="Button",
    Select="Select menu",
    StringSelect="String select menu",
    UserSelect="User select menu",
    RoleSelect="Role select menu",
    ChannelSelect="Channel select menu",
    MentionableSelect="Mentionable select menu",
    Row="Row",
    Modal="Modal",
    ModalComponent="Modal component",
    All="Component or modal"
}
export type ResponderInteraction<Type extends ResponderType, Cache extends CacheType> = {
    [ResponderType.Button]: ButtonInteraction<Cache>,
    [ResponderType.Select]: AnySelectMenuInteraction<Cache>,
    [ResponderType.StringSelect]: StringSelectMenuInteraction<Cache>,
    [ResponderType.UserSelect]: UserSelectMenuInteraction<Cache>,
    [ResponderType.RoleSelect]: RoleSelectMenuInteraction<Cache>,
    [ResponderType.ChannelSelect]: ChannelSelectMenuInteraction<Cache>,
    [ResponderType.MentionableSelect]: MentionableSelectMenuInteraction<Cache>,
    [ResponderType.Row]: MessageComponentInteraction<Cache>,
    [ResponderType.Modal]: ModalSubmitInteraction<Cache>,
    [ResponderType.ModalComponent]: ModalMessageModalSubmitInteraction<Cache>,
    [ResponderType.All]: MessageComponentInteraction<Cache> | ModalSubmitInteraction<Cache>
}[Type]

type ResolveParams<Path, Parsed> = 
    Parsed extends { [x: string | number | symbol]: any } 
        ? Parsed 
        : Params<Path>;

interface ResponderData<Path, Type extends ResponderType, Parsed, Cache extends CacheType> {
    customId: CheckRoute<Path>, type: Type, cache?: Cache;
    parse?(params: Params<Path>, interaction: ResponderInteraction<Type, Cache>): Parsed | Promise<Parsed>;
    run(interaction: ResponderInteraction<Type, Cache>, params: ResolveParams<Path, Parsed>): void;
}

type ResponderDataGeneric = ResponderData<string, ResponderType, any, CacheType>;
type ResponderRouter = RadixRouter<ResponderDataGeneric>;

export class Responder<Path extends string, Type extends ResponderType, Schema, Cache extends CacheType = CacheType> {
    private static routers = new Map<ResponderType, ResponderRouter>;
    private static logs = new Map<ResponderType, Set<string>>();
    public constructor(data: ResponderData<Path, Type, Schema, Cache>){
        const router = Responder.routers.get(data.type) ?? createRouter();
        router.insert(data.customId, data);
        Responder.routers.set(data.type, router);
        const log = Responder.logs.get(data.type) ?? new Set();
        log.add(data.customId);
        Responder.logs.set(data.type, log);
    }
    private static getResponderType(interaction: ResponderInteraction<ResponderType, CacheType>){
        return interaction.isButton() ? ResponderType.Button : 
        interaction.isStringSelectMenu() ? ResponderType.StringSelect : 
        interaction.isChannelSelectMenu() ? ResponderType.ChannelSelect : 
        interaction.isRoleSelectMenu() ? ResponderType.RoleSelect : 
        interaction.isUserSelectMenu() ? ResponderType.UserSelect : 
        interaction.isMentionableSelectMenu() ? ResponderType.MentionableSelect : 
        interaction.isModalSubmit() && interaction.isFromMessage() ? ResponderType.ModalComponent : 
        interaction.isModalSubmit() ? ResponderType.Modal : undefined;
    }
    public static async onInteraction(interaction: MessageComponentInteraction | ModalSubmitInteraction){
        console.time("Responder time");
        const responderType = Responder.getResponderType(interaction);
        if (!responderType) return;

        const router = Responder.routers.get(responderType) ?? Responder.findRouter(responderType);
        if (!router) {
            Responder.options.onNotFound?.(interaction);
            return;
        };

        const handler = Responder.findHandler(router, responderType, interaction.customId);
        if (!handler || !handler.run){
            Responder.options.onNotFound?.(interaction);
            return;
        }
        if (handler.params){
            if (handler.parse){
                const params = handler.parse(handler.params, interaction);
                handler.params = isPromise(params) ? await params : params; 
            }
        } else handler.params = {};
        handler.run(interaction, handler.params);
    }
    private static findHandler(router: ResponderRouter | undefined, type: ResponderType, customId: string): MatchedRoute<ResponderDataGeneric> | null {
        if (!router) return null;
        const handler = router.lookup(customId);
        if (handler) return handler;
        switch(type){
            case ResponderType.StringSelect: case ResponderType.ChannelSelect:
            case ResponderType.UserSelect: case ResponderType.MentionableSelect:
            case ResponderType.RoleSelect:{
                router = Responder.findRouter(type); type = ResponderType.Select;
                break;
            }
            case ResponderType.Select: case ResponderType.Button:{
                router = Responder.findRouter(type); type = ResponderType.Row;
                break;
            }
            case ResponderType.ModalComponent:{
                router = Responder.findRouter(type); type = ResponderType.Modal;
                break;
            }
            case ResponderType.Modal: case ResponderType.Row:{
                router = Responder.findRouter(type); type = ResponderType.All;
                break;
            }
            case ResponderType.All: return null;
        }
        return Responder.findHandler(router, type, customId);

    }
    private static findRouter(type: ResponderType): ResponderRouter | undefined {
        switch(type){
            case ResponderType.StringSelect: case ResponderType.ChannelSelect:
            case ResponderType.UserSelect: case ResponderType.MentionableSelect:
            case ResponderType.RoleSelect: 
                type = ResponderType.Select; break;
            case ResponderType.Select:
            case ResponderType.Button: 
                type = ResponderType.Row; break;
            case ResponderType.ModalComponent: 
                type = ResponderType.Modal; break;
            case ResponderType.Row:
            case ResponderType.Modal: 
                type = ResponderType.All; break;
            case ResponderType.All: 
                return undefined;
        }
        return Responder.routers.get(type) ?? Responder.findRouter(type);
    }
    private static options: ResponderHandlerOptions = {};
    public static setup(options: ResponderHandlerOptions){ 
        Responder.options = options;
    }
    public static loadLogs(){
        for(const [type, list]  of Responder.logs.entries()){
            for(const customId of list.values()){
                const u = ck.underline;
                log.success(ck.green(
                    spaceBuilder(u.greenBright(type),u.blue(customId),"responder loaded!")
                ));
            }
        } 
        Responder.logs.clear();
    }
}

type CheckRoute<R> = 
    R extends `/${string}` ? never :
    R extends `${string}/` ? never :
    R extends `:${string}` ? never :
    R extends `${string}:` ? never :
    R extends `*${string}` ? never :
    R

type ExtractParam<Seg> = 
    Seg extends `:${infer Param}` ? Param :
    Seg extends `**:${infer Param}` ? Param :
    Seg extends "**" ? "_" :
    Seg extends "*" ? `_${number}` : 
    never;

type GetParams<Route> = 
    Route extends `${infer Seg}/${infer Rest}` 
        ? ExtractParam<Seg> | GetParams<Rest>
        : ExtractParam<Route>;

type Params<P> = { [K in GetParams<P>]: string } & {};