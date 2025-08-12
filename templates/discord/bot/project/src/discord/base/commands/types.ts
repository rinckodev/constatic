import type { ApplicationCommandOptionAllowedChannelTypes, ApplicationCommandOptionChoiceData, ApplicationCommandOptionType, ApplicationCommandType, AutocompleteInteraction, BaseApplicationCommandData, CacheType, ChatInputCommandInteraction, LocalizationMap, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from "discord.js";

export type CommandType = Exclude<
    ApplicationCommandType, 
    ApplicationCommandType.PrimaryEntryPoint
>;

type AutocompleData<T> = Promise<
    | readonly ApplicationCommandOptionChoiceData<
        T extends (number | string) ? T : (number | string)
    >[]
    | undefined 
    | void 
>;

export type AutocompleteRun<T, P> = (
    this: void,
    interaction: AutocompleteInteraction<CacheMode<P>>
) => AutocompleData<T>;

interface AutocompleteOptionData<T, P> {
    autocomplete?: true | AutocompleteRun<T, P>;
}

interface BaseOptionData {
    name: string;
    nameLocalizations?: LocalizationMap;
    description?: string;
    descriptionLocalizations?: LocalizationMap;
    required?: boolean;
}

interface StringOptionData<P> extends 
    BaseOptionData, 
    AutocompleteOptionData<string, P>
{
    type: ApplicationCommandOptionType.String,
    choices?: readonly ApplicationCommandOptionChoiceData<string>[];
    minLength?: number;
    maxLength?: number;
}

interface NumberOptionData<P> extends 
    BaseOptionData, 
    AutocompleteOptionData<number, P>
{
    type: 
        | ApplicationCommandOptionType.Number
        | ApplicationCommandOptionType.Integer;
    choices?: readonly ApplicationCommandOptionChoiceData<number>[];
    minValue?: number;
    maxValue?: number;
}

interface ChannelOptionData extends BaseOptionData {
    type: ApplicationCommandOptionType.Channel
    channelTypes?: readonly ApplicationCommandOptionAllowedChannelTypes[]
}
interface CommonOptionData extends BaseOptionData {
    type: 
        | ApplicationCommandOptionType.Attachment
        | ApplicationCommandOptionType.Boolean
        | ApplicationCommandOptionType.Mentionable
        | ApplicationCommandOptionType.Role
        | ApplicationCommandOptionType.User
}

export interface SubCommandOptionData<P> extends Omit<BaseOptionData, "required"> {
    type: ApplicationCommandOptionType.Subcommand,
    options?: SlashCommandPrimitiveOptionData<P>[]
}

export interface GroupOptionData<P> extends Omit<BaseOptionData, "required"> {
    type: ApplicationCommandOptionType.SubcommandGroup,
    options: SubCommandOptionData<P>[]
}

type RunThis = {
    /**
     * Blocks the flow of executions
     */
    block(): never;
}

export type SlashCommandPrimitiveOptionData<P> = 
    | StringOptionData<P>
    | NumberOptionData<P>
    | CommonOptionData
    | ChannelOptionData;

export type SlashCommandOptionData<P> =
        | SlashCommandPrimitiveOptionData<P>
        | GroupOptionData<P>
        | SubCommandOptionData<P>

type CacheMode<P> = P extends false ? "cached" : CacheType;

type RunInteraction<T, P> = 
    T extends ApplicationCommandType.Message 
        ? MessageContextMenuCommandInteraction<CacheMode<P>> : 
    T extends ApplicationCommandType.User 
        ? UserContextMenuCommandInteraction<CacheMode<P>> : 
    ChatInputCommandInteraction<CacheMode<P>> 

type BaseAppCommandData = 
    & Omit<BaseApplicationCommandData, "dmPermission">
    & Pick<BaseOptionData, "descriptionLocalizations">

export interface AppCommandData<T, P, R> extends BaseAppCommandData {
    name: string;
    description?: string;
    dmPermission?: P;
    type?: T;
    global?: boolean;
    run?: (this: RunThis, interaction: RunInteraction<T, P>) => Promise<R>;
    autocomplete?: AutocompleteRun<string | number, P>;
    options?: 
        | SlashCommandPrimitiveOptionData<P>[]
        | (GroupOptionData<P> | SubCommandOptionData<P>)[]
};

export type GenericAppCommandData = AppCommandData<
    CommandType, boolean, unknown
>;

type ResolveCommandModuleData<R> = R extends void ? undefined : R;

export type SubCommandModuleData<P extends boolean, R> = 
    Omit<BaseOptionData, "required"> & {
        group?: string;
        run(
            this: RunThis, 
            interaction: ChatInputCommandInteraction<CacheMode<P>>, 
            data: ResolveCommandModuleData<R>
        ): Promise<void>;
        options?: SlashCommandPrimitiveOptionData<P>[]
    };

export type SubCommandGroupModuleData<P extends boolean, R, T> = 
    Omit<BaseOptionData, "required"> & {
        options?: Omit<SubCommandOptionData<P>, "type">[]
        run?(
            this: RunThis, 
            interaction: ChatInputCommandInteraction<CacheMode<P>>, 
            data: ResolveCommandModuleData<R>
        ): Promise<T>;
    };

type CommandInstanceMethods<
    M extends "group" | "subcommand", 
    D extends boolean, 
    R
> = Pick<{
    group<T = R>(data: SubCommandGroupModuleData<D, R, T>): CommandInstanceMethods<"subcommand", D, T>;
    subcommand(data: Omit<SubCommandModuleData<D, R>, "group">): void;
}, M>;

export type CommandInstance<
    T extends CommandType,
    P extends boolean,
    R
> = AppCommandData<T, P, R> & (T extends ApplicationCommandType.ChatInput 
    ? CommandInstanceMethods<"group" | "subcommand", P, R>
    : {}
);

export type CommandModule =
    | (SubCommandGroupModuleData<boolean, unknown, unknown> & {
        type: ApplicationCommandOptionType.SubcommandGroup
    })
    | (SubCommandModuleData<boolean, unknown> & { 
        type: ApplicationCommandOptionType.Subcommand
        group?: string 
    });

export type GenericCommandHandler = (
    this: void,
    interaction: unknown, 
    data?: unknown
) => Promise<unknown>;

export class RunBlockError extends Error {
    constructor(){
        super("The execution flow has been blocked");
        this.name = "RunBlockError";
    }
}