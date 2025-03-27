import { CacheType, Client, ClientEvents, Collection, CommandInteraction } from "discord.js";
import { GenericCommandData } from "./base.command.ts";
import { EventsCollection } from "./base.event.ts";
import { GenericResponderInteraction, ResponderData, ResponderInteraction, ResponderRouter, ResponderType } from "./base.responder.ts";

export type ContextName<S extends string> = S extends "" ? never : S;
export type SlashName<S extends string> =
    S extends "" ? never :
    S extends `${string} ${string}` ? never :
    S extends Lowercase<S> ? S : never

export type CheckRoute<R> = 
    R extends `/${string}` ? never :
    R extends `${string}/` ? never :
    R extends `:${string}` ? never :
    R extends `${string}:` ? never :
    R extends `*${string}` ? never :
    R

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

export type UnionToIntersection<U> = 
  (U extends any ? (x: U) => void : never) extends (x: infer I) => void 
    ? I 
    : never;

export type RecordKey = string | number | symbol;

export type Prettify<T> = {
    [K in keyof T]: T[K]
} & {}

export type NotEmptyArray<T> = T extends never[] ? never : T;

// https://stackoverflow.com/a/64519702
export type UniqueArray<T> =
  T extends readonly [infer X, ...infer Rest]
    ? InArray<Rest, X> extends true
      ? ["Encountered value with duplicates:", X]
      : readonly [X, ...UniqueArray<Rest>]
    : T

type InArray<T, X> =
  T extends readonly [X, ...infer _Rest]
    ? true
    : T extends readonly [X]
      ? true
      : T extends readonly [infer _, ...infer Rest]
        ? InArray<Rest, X>
        : false

interface BaseStorageCommandConfig {
    guilds: string[];
    verbose?: boolean;
    middleware?(interaction: CommandInteraction, block: ()=> void): Promise<void>;
    onNotFound?(interaction: CommandInteraction): void;
    onError?(error: unknown, interaction: CommandInteraction): void;
}

interface BaseStorageRespondersConfig {
    middleware?(interaction: GenericResponderInteraction, block: ()=> void, params: object): Promise<void>;
    onNotFound?(interaction: GenericResponderInteraction): void;
    onError?(error: unknown, interaction: GenericResponderInteraction, params: object): void;
}

type EventPropData = {
    [Key in keyof ClientEvents]: {
        name: Key;
        args: ClientEvents[Key]
    }
}[keyof ClientEvents]

interface BaseStorageEventsConfig {
    middleware?(event: EventPropData, block: (...tags: string[]) => void): Promise<void>;
    onError?(error: unknown, event: EventPropData): void;
}

interface BaseStorageConfig {
    commands: BaseStorageCommandConfig
    responders: BaseStorageRespondersConfig;
    events: BaseStorageEventsConfig;
}

interface BaseStorageLoadLogs {
    commands: string[],
    responders: string[],
    events: string[]
}

export interface BaseStorage {
    commands: Collection<string, GenericCommandData>;
    events: Collection<keyof ClientEvents, EventsCollection>;
    responders: ResponderRouter;
    config: BaseStorageConfig;
    loadLogs: BaseStorageLoadLogs;
}