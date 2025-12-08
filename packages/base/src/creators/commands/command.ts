import { ApplicationCommandOptionType, ApplicationCommandType, AutocompleteInteraction, ChatInputCommandInteraction, InteractionContextType, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction, type ApplicationCommandOptionAllowedChannelType, type ApplicationCommandOptionChoiceData, type BaseApplicationCommandData, type CacheType, type LocalizationMap } from "discord.js";

export type CommandType = Exclude<
    ApplicationCommandType,
    ApplicationCommandType.PrimaryEntryPoint
>;

type AutocompleData<Type> = Promise<
    | readonly ApplicationCommandOptionChoiceData<
        Type extends (number | string) ? Type : (number | string)
    >[]
    | undefined
    | void
>;

export type AutocompleteRun<Type, Contexts> = (
    this: void,
    interaction: AutocompleteInteraction<CacheMode<Contexts>>
) => AutocompleData<Type>;

interface AutocompleteOptionData<Type, Contexts> {
    autocomplete?: true | AutocompleteRun<Type, Contexts>;
}

interface BaseOptionData {
    name: string;
    nameLocalizations?: LocalizationMap;
    description?: string;
    descriptionLocalizations?: LocalizationMap;
    required?: boolean;
}

interface StringOptionData<Contexts> extends
    BaseOptionData, AutocompleteOptionData<string, Contexts> {
    type: ApplicationCommandOptionType.String,
    choices?: readonly ApplicationCommandOptionChoiceData<string>[];
    minLength?: number;
    maxLength?: number;
}

interface NumberOptionData<Contexts> extends
    BaseOptionData, AutocompleteOptionData<number, Contexts> {
    type:
    | ApplicationCommandOptionType.Number
    | ApplicationCommandOptionType.Integer;
    choices?: readonly ApplicationCommandOptionChoiceData<number>[];
    minValue?: number;
    maxValue?: number;
}

interface ChannelOptionData extends BaseOptionData {
    type: ApplicationCommandOptionType.Channel
    channelTypes?: readonly ApplicationCommandOptionAllowedChannelType[]
}
interface CommonOptionData extends BaseOptionData {
    type:
    | ApplicationCommandOptionType.Attachment
    | ApplicationCommandOptionType.Boolean
    | ApplicationCommandOptionType.Mentionable
    | ApplicationCommandOptionType.Role
    | ApplicationCommandOptionType.User
}

export type SlashCommandPrimitiveOptionData<Contexts> =
    | StringOptionData<Contexts>
    | NumberOptionData<Contexts>
    | CommonOptionData
    | ChannelOptionData;

export interface SubCommandOptionData<Contexts> extends Omit<BaseOptionData, "required"> {
    type: ApplicationCommandOptionType.Subcommand,
    options?: SlashCommandPrimitiveOptionData<Contexts>[]
}

export interface GroupOptionData<Contexts> extends Omit<BaseOptionData, "required"> {
    type: ApplicationCommandOptionType.SubcommandGroup,
    options: SubCommandOptionData<Contexts>[]
}

type CacheMode<Contexts> = Contexts extends readonly InteractionContextType[]
    ? {
        [InteractionContextType.Guild]: "cached",
        [InteractionContextType.BotDM]: CacheType,
        [InteractionContextType.PrivateChannel]: CacheType,
    }[Contexts[number]]
    : CacheType;

interface CommandRunThis {
    /**
     * Blocks the flow of executions
     */
    block(): never;
}

type ResolveCommandModuleData<Return> = Return extends void ? undefined : Return;

export type SubCommandModuleData<Contexts, Return> =
    Omit<BaseOptionData, "required"> & {
        group?: string;
        run(
            this: CommandRunThis,
            interaction: ChatInputCommandInteraction<CacheMode<Contexts>>,
            data: ResolveCommandModuleData<Return>
        ): Promise<void>;
        options?: SlashCommandPrimitiveOptionData<Contexts>[]
    };

export type SubCommandGroupModuleData<Contexts, Return, T> =
    Omit<BaseOptionData, "required"> & {
        options?: Omit<SubCommandOptionData<Contexts>, "type">[]
        run?(
            this: CommandRunThis,
            interaction: ChatInputCommandInteraction<CacheMode<Contexts>>,
            data: ResolveCommandModuleData<Return>
        ): Promise<T>;
    };

type RunInteraction<T, Contexts> =
    T extends ApplicationCommandType.Message
    ? MessageContextMenuCommandInteraction<CacheMode<Contexts>> :
    T extends ApplicationCommandType.User
    ? UserContextMenuCommandInteraction<CacheMode<Contexts>> :
    ChatInputCommandInteraction<CacheMode<Contexts>>

type BaseAppCommandData =
    & Omit<BaseApplicationCommandData, "contexts">
    & Pick<BaseOptionData, "descriptionLocalizations">

export interface CommandData<T, Contexts, R> extends BaseAppCommandData {
    name: string;
    description?: string;
    contexts?: Contexts
    type?: T;
    global?: boolean;
    run?(this: CommandRunThis, interaction: RunInteraction<T, Contexts>): Promise<R>;
    autocomplete?: AutocompleteRun<string | number, Contexts>;
    options?:
    | SlashCommandPrimitiveOptionData<Contexts>[]
    | (GroupOptionData<Contexts> | SubCommandOptionData<Contexts>)[];
}

export type SlashCommandOptionData<Contexts> =
    | SlashCommandPrimitiveOptionData<Contexts>
    | GroupOptionData<Contexts>
    | SubCommandOptionData<Contexts>

export type CommandModule =
    | (SubCommandGroupModuleData<unknown, unknown, unknown> & {
        type: ApplicationCommandOptionType.SubcommandGroup
    })
    | (SubCommandModuleData<unknown, unknown> & {
        type: ApplicationCommandOptionType.Subcommand
        group?: string
    });

class GroupCommandModule<
    Type,
    Contexts extends readonly InteractionContextType[],
    Return,
    ModuleReturn
> {
    constructor(
        public readonly command: Command<Type, Contexts, Return>,
        public readonly data: SubCommandGroupModuleData<Contexts, Return, ModuleReturn>
    ) { }
    public subcommand(data: SubCommandModuleData<Contexts, ModuleReturn>) {
        data.group ??= this.data.name;
        this.command.subcommand(data);
        return this;
    }
}

export class Command<
    Type,
    Contexts extends readonly InteractionContextType[],
    Return
> {
    public readonly modules: CommandModule[] = []
    constructor(
        public readonly data: CommandData<Type, Contexts, Return>
    ) {
        this.data.type ??= <Type>ApplicationCommandType.ChatInput
        if (this.data.type === ApplicationCommandType.ChatInput) {
            this.data.description ??= this.data.name;
            this.data.name = this.data.name
                .toLowerCase()
                .replaceAll(" ", "");
        }
        if (this.data.name.length > 32) {
            this.data.name = this.data.name.slice(0, 32);
        }
        if (!this.data.contexts){
            Object.assign(this.data, {
                contexts: [InteractionContextType.Guild]
            });
        }
    }
    public group<ModuleReturn = Return>(data: SubCommandGroupModuleData<Contexts, Return, ModuleReturn>) {
        this.modules.push({
            ...data,
            type: ApplicationCommandOptionType.SubcommandGroup
        });
        return new GroupCommandModule<Type, Contexts, Return, ModuleReturn>(
            this, data
        );
    }
    public subcommand<R = Return>(data: SubCommandModuleData<Contexts, R>) {
        this.modules.push({
            ...data,
            type: ApplicationCommandOptionType.Subcommand
        });
        return this;
    }
}