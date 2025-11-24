import { ApplicationCommandOptionType, ApplicationCommandType, AutocompleteInteraction, ChatInputCommandInteraction, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction, type ApplicationCommandOptionAllowedChannelTypes, type ApplicationCommandOptionChoiceData, type BaseApplicationCommandData, type CacheType, type LocalizationMap } from "discord.js";

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

export type AutocompleteRun<Type, Perm> = (
    this: void,
    interaction: AutocompleteInteraction<CacheMode<Perm>>
) => AutocompleData<Type>;

interface AutocompleteOptionData<Type, Perm> {
    autocomplete?: true | AutocompleteRun<Type, Perm>;
}

interface BaseOptionData {
    name: string;
    nameLocalizations?: LocalizationMap;
    description?: string;
    descriptionLocalizations?: LocalizationMap;
    required?: boolean;
}

interface StringOptionData<Perm> extends
    BaseOptionData, AutocompleteOptionData<string, Perm> {
    type: ApplicationCommandOptionType.String,
    choices?: readonly ApplicationCommandOptionChoiceData<string>[];
    minLength?: number;
    maxLength?: number;
}

interface NumberOptionData<P> extends
    BaseOptionData, AutocompleteOptionData<number, P> {
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

export type SlashCommandPrimitiveOptionData<Perm> =
    | StringOptionData<Perm>
    | NumberOptionData<Perm>
    | CommonOptionData
    | ChannelOptionData;

export interface SubCommandOptionData<Perm> extends Omit<BaseOptionData, "required"> {
    type: ApplicationCommandOptionType.Subcommand,
    options?: SlashCommandPrimitiveOptionData<Perm>[]
}

export interface GroupOptionData<Perm> extends Omit<BaseOptionData, "required"> {
    type: ApplicationCommandOptionType.SubcommandGroup,
    options: SubCommandOptionData<Perm>[]
}

type CacheMode<Perm> = Perm extends false ? "cached" : CacheType;

interface CommandRunThis {
    /**
     * Blocks the flow of executions
     */
    block(): never;
}

type ResolveCommandModuleData<Return> = Return extends void ? undefined : Return;

export type SubCommandModuleData<Perm, Return> =
    Omit<BaseOptionData, "required"> & {
        group?: string;
        run(
            this: CommandRunThis,
            interaction: ChatInputCommandInteraction<CacheMode<Perm>>,
            data: ResolveCommandModuleData<Return>
        ): Promise<void>;
        options?: SlashCommandPrimitiveOptionData<Perm>[]
    };

export type SubCommandGroupModuleData<Perm, Return, T> =
    Omit<BaseOptionData, "required"> & {
        options?: Omit<SubCommandOptionData<Perm>, "type">[]
        run?(
            this: CommandRunThis,
            interaction: ChatInputCommandInteraction<CacheMode<Perm>>,
            data: ResolveCommandModuleData<Return>
        ): Promise<T>;
    };

type RunInteraction<T, P> =
    T extends ApplicationCommandType.Message
    ? MessageContextMenuCommandInteraction<CacheMode<P>> :
    T extends ApplicationCommandType.User
    ? UserContextMenuCommandInteraction<CacheMode<P>> :
    ChatInputCommandInteraction<CacheMode<P>>

type BaseAppCommandData =
    & Omit<BaseApplicationCommandData, "dmPermission">
    & Pick<BaseOptionData, "descriptionLocalizations">

export interface CommandData<T, P, R> extends BaseAppCommandData {
    name: string;
    description?: string;
    dmPermission?: P;
    type?: T;
    global?: boolean;
    run?(this: CommandRunThis, interaction: RunInteraction<T, P>): Promise<R>;
    autocomplete?: AutocompleteRun<string | number, P>;
    options?:
    | SlashCommandPrimitiveOptionData<P>[]
    | (GroupOptionData<P> | SubCommandOptionData<P>)[];
}

export type SlashCommandOptionData<Perm> =
    | SlashCommandPrimitiveOptionData<Perm>
    | GroupOptionData<Perm>
    | SubCommandOptionData<Perm>

export type CommandModule =
    | (SubCommandGroupModuleData<unknown, unknown, unknown> & {
        type: ApplicationCommandOptionType.SubcommandGroup
    })
    | (SubCommandModuleData<unknown, unknown> & {
        type: ApplicationCommandOptionType.Subcommand
        group?: string
    });

class GroupCommandModule<Type, Perm, Return, ModuleReturn> {
    constructor(
        public readonly command: Command<Type, Perm, Return>,
        public readonly data: SubCommandGroupModuleData<Perm, Return, ModuleReturn>
    ) { }
    public subcommand(data: SubCommandModuleData<Perm, ModuleReturn>) {
        data.group ??= this.data.name;
        this.command.subcommand(data);
        return this;
    }
}

export class Command<Type, Perm, Return> {
    public readonly modules: CommandModule[] = []
    constructor(
        public readonly data: CommandData<Type, Perm, Return>
    ) {
        this.data.type ??= <Type>ApplicationCommandType.ChatInput
        this.data.dmPermission ??= <Perm>false;
        if (this.data.type === ApplicationCommandType.ChatInput){
            this.data.description??=this.data.name;
            this.data.name = this.data.name
                .toLowerCase()
                .replaceAll(" ", "");
        }
        if (this.data.name.length > 32){
            this.data.name = this.data.name.slice(0, 32);
        }
    }
    public group<ModuleReturn>(data: SubCommandGroupModuleData<Perm, Return, ModuleReturn>) {
        this.modules.push({ ...data, 
            type: ApplicationCommandOptionType.SubcommandGroup
        });
        return new GroupCommandModule<Type, Perm, Return, ModuleReturn>(
            this, data
        );
    }
    public subcommand<R = Return>(data: SubCommandModuleData<Perm, R>) {
        this.modules.push({ ...data, 
            type: ApplicationCommandOptionType.Subcommand
        });
        return this;
    }
}