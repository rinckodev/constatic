import type { ButtonInteraction, CacheType, ChannelSelectMenuInteraction, MentionableSelectMenuInteraction, MessageComponentInteraction, ModalMessageModalSubmitInteraction, ModalSubmitInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from "discord.js";

export type CheckRoute<R> =
    R extends `${string}/` ? "Custom ID must not end with a slash" :
    R extends `:${string}` ? "Custom ID must not be a parameter only" :
    R extends `${string}:` ? "Custom ID must not end with a colon" :
    R extends `*${string}` ? "Custom ID must not start with a wildcard" :
    R;

export type ExtractParam<Seg> =
    Seg extends `:${infer Param}` ? Param :
    Seg extends `**:${infer Param}` ? Param :
    Seg extends "**" ? "_" :
    Seg extends "*" ? `_${number}` :
    never;

export type GetParams<Route> =
    Route extends `${infer Seg}/${infer Rest}`
        ? ExtractParam<Seg> | GetParams<Rest>
        : ExtractParam<Route>;

type Params<P> = { [K in GetParams<P>]: string } & {};

type Prettify<T> = {
    [K in keyof T]: T[K]
} & {}

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
    Button = "button",
    StringSelect = "select.string",
    UserSelect = "select.user",
    RoleSelect = "select.role",
    ChannelSelect = "select.channel",
    MentionableSelect = "select.mentionable",
    Modal = "modal",
    ModalComponent = "modal.component",
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
    parse?(this: void, params: Params<Path>): Parsed;
    run(this: void, interaction: ResponderInteraction<Types[number], Cache>, params: ResolveParams<Path, Parsed>): Promise<void>;
}

export type GenericResponderData = ResponderData<
    string, readonly ResponderType[], any, CacheType
>;
export type GenericResponderInteraction =
    | MessageComponentInteraction<CacheType>
    | ModalSubmitInteraction<CacheType>;