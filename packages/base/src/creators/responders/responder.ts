import type { ButtonInteraction, CacheType, ChannelSelectMenuInteraction, MentionableSelectMenuInteraction, ModalMessageModalSubmitInteraction, ModalSubmitInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from "discord.js";
import { type InferRouteParams } from "rou3";
import type { Prettify } from "../../utils/types.js";

type NotEmptyArray<T> = T extends never[] ? never : T;

// https://stackoverflow.com/a/64519702
type UniqueArray<T> =
    T extends readonly [infer X, ...infer Rest]
    ? InArray<Rest, X> extends true
    ? ["Encountered value with duplicates:", X]
    : readonly [X, ...UniqueArray<Rest>]
    : T

type InArray<T, X> =
    T extends readonly [X, ...infer _Rest] ? true :
    T extends readonly [X] ? true :
    T extends readonly [infer _, ...infer Rest]
    ? InArray<Rest, X>
    : false

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