import type { ButtonInteraction, CacheType, ChannelSelectMenuInteraction, MentionableSelectMenuInteraction, ModalMessageModalSubmitInteraction, ModalSubmitInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from "discord.js";
import { type InferRouteParams } from "rou3";
import type { NotEmptyArray, Prettify, UniqueArray } from "../../utils/types.js";

export enum ResponderType {
    Button = "button",
    StringSelect = "select.string",
    UserSelect = "select.user",
    RoleSelect = "select.role",
    ChannelSelect = "select.channel",
    MentionableSelect = "select.mentionable",
    Modal = "modal",
    ModalComponent = "modal.component",
}

export type ResponderInteraction<Type extends ResponderType, Cache extends CacheType> = {
    [ResponderType.Button]: ButtonInteraction<Cache>,
    [ResponderType.StringSelect]: StringSelectMenuInteraction<Cache>,
    [ResponderType.UserSelect]: UserSelectMenuInteraction<Cache>,
    [ResponderType.RoleSelect]: RoleSelectMenuInteraction<Cache>,
    [ResponderType.ChannelSelect]: ChannelSelectMenuInteraction<Cache>,
    [ResponderType.MentionableSelect]: MentionableSelectMenuInteraction<Cache>,
    [ResponderType.Modal]: ModalSubmitInteraction<Cache>,
    [ResponderType.ModalComponent]: ModalMessageModalSubmitInteraction<Cache>,
}[Type];

type ResolveParams<Path extends string, Parsed> = Prettify<
    Parsed extends { [x: string | number | symbol]: any }
        ? Parsed
        : InferRouteParams<Path>
>;

export interface ResponderData<
    Path extends string,
    Types extends readonly ResponderType[],
    out Parsed,
    Cache extends CacheType,
> {
    customId: Path,
    types: NotEmptyArray<UniqueArray<Types>>,
    cache?: Cache;
    parse?(this: void, params: InferRouteParams<Path>): Parsed;
    run(
        this: void,
        interaction: ResponderInteraction<Types[number], Cache>,
        params: ResolveParams<Path, Parsed>
    ): Promise<void>;
}

export class Responder<
    Path extends string,
    Types extends readonly ResponderType[],
    out Parsed,
    Cache extends CacheType,
> {
    constructor(
        public readonly data: ResponderData<Path, Types, Parsed, Cache>
    ){}
}