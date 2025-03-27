import { spaceBuilder } from "@magicyan/discord";
import ck from "chalk";
import { ButtonInteraction, CacheType, ChannelSelectMenuInteraction, MentionableSelectMenuInteraction, MessageComponentInteraction, ModalMessageModalSubmitInteraction, ModalSubmitInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from "discord.js";
import { findRoute, RouterContext } from "rou3";
import { baseStorage } from "./base.storage.js";
import { CheckRoute, NotEmptyArray, Params, Prettify, UniqueArray } from "./base.types.js";

export type ResponderInteraction<Type extends ResponderType, Cache extends CacheType> = {
    [ResponderType.Button]: ButtonInteraction<Cache>,
    [ResponderType.StringSelect]: StringSelectMenuInteraction<Cache>,
    [ResponderType.UserSelect]: UserSelectMenuInteraction<Cache>,
    [ResponderType.RoleSelect]: RoleSelectMenuInteraction<Cache>,
    [ResponderType.ChannelSelect]: ChannelSelectMenuInteraction<Cache>,
    [ResponderType.MentionableSelect]: MentionableSelectMenuInteraction<Cache>,
    [ResponderType.Modal]: ModalSubmitInteraction<Cache>,
    [ResponderType.ModalComponent]: ModalMessageModalSubmitInteraction<Cache>,
}[Type]

export enum ResponderType {
    Button="button",
    StringSelect="select.string",
    UserSelect="select.user",
    RoleSelect="select.role",
    ChannelSelect="select.channel",
    MentionableSelect="select.mentionable",
    Modal="modal",
    ModalComponent="modal.component",
}

type ResolveParams<Path, Parsed> = Prettify<
    Parsed extends { [x: string | number | symbol]: any } 
        ? Parsed 
        : Params<Path>
>;

export interface ResponderData<
    Path extends string, 
    Types extends readonly ResponderType[], 
    out Parsed, 
    Cache extends CacheType
> {
    customId: CheckRoute<Path>, 
    types: NotEmptyArray<UniqueArray<Types>>, 
    cache?: Cache;
    parse?(params: Params<Path>): Parsed;
    run(interaction: ResponderInteraction<Types[number], Cache>, params: ResolveParams<Path, Parsed>): Promise<void>;
}

type GenericResponderData = ResponderData<string, readonly ResponderType[], any, CacheType>;
export type ResponderRouter = RouterContext<GenericResponderData>;
export type GenericResponderInteraction = MessageComponentInteraction<CacheType> | ModalSubmitInteraction<CacheType>;

function getResponderType(interaction: MessageComponentInteraction | ModalSubmitInteraction){
    return interaction.isButton() ? ResponderType.Button : 
    interaction.isStringSelectMenu() ? ResponderType.StringSelect : 
    interaction.isChannelSelectMenu() ? ResponderType.ChannelSelect : 
    interaction.isRoleSelectMenu() ? ResponderType.RoleSelect : 
    interaction.isUserSelectMenu() ? ResponderType.UserSelect : 
    interaction.isMentionableSelectMenu() ? ResponderType.MentionableSelect : 
    interaction.isModalSubmit() && interaction.isFromMessage() ? ResponderType.ModalComponent : 
    interaction.isModalSubmit() ? ResponderType.Modal : undefined;
}

export async function baseResponderHandler(interaction: MessageComponentInteraction | ModalSubmitInteraction){
    const onNotFound = baseStorage.config.responders.onNotFound;
    const responderType = getResponderType(interaction);
    if (!responderType){
        onNotFound?.(interaction);
        return;
    }

    const handler = findRoute(baseStorage.responders, responderType, interaction.customId);
    if (!handler){
        onNotFound?.(interaction);
        return;
    }

    if (handler.params && handler.data.parse){
        handler.params=handler.data.parse(handler.params);
    }

    const params = Object.assign({}, handler.params);

    const middleware = baseStorage.config.responders.middleware;
    const onError = baseStorage.config.responders.onError;

    let block = false;
    if (middleware) await middleware(interaction, () => block=true, params);
    if (block) return;
    
    const execution = handler.data.run(interaction as never, params);
    if (onError){
        await execution.catch(error => onError(error, interaction, params));
    } else {
        await execution;
    }
}

export function baseResponderLog(customId: string, type: string){
    const u = ck.underline;
    baseStorage.loadLogs.responders
    .push(ck.green(spaceBuilder(ck.greenBright(`▸ ${type}`),ck.gray(">"), u.blue(customId),"✓")))
}