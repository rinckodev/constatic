import type { ButtonInteraction, CacheType, ChannelSelectMenuInteraction, ChatInputCommandInteraction, MentionableSelectMenuInteraction, MessageContextMenuCommandInteraction, ModalMessageModalSubmitInteraction, ModalSubmitInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserContextMenuCommandInteraction, UserSelectMenuInteraction } from "discord.js";
import { type InferRouteParams } from "rou3";
import type { NotEmptyArray, Prettify, UniqueArray } from "../../utils/types.js";
import type { WithCustomId } from "./emit.js";

export enum ResponderType {
    Button = "button",
    StringSelect = "select.string",
    UserSelect = "select.user",
    RoleSelect = "select.role",
    ChannelSelect = "select.channel",
    MentionableSelect = "select.mentionable",
    Modal = "modal",
    ModalComponent = "modal.component",
    ChatInput = "command.chat.input",
    UserContextMenu = "command.context.user",
    MessageContextMenu = "command.context.message",
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
    [ResponderType.ChatInput]: WithCustomId<ChatInputCommandInteraction<Cache>>,
    [ResponderType.UserContextMenu]: WithCustomId<UserContextMenuCommandInteraction<Cache>>,
    [ResponderType.MessageContextMenu]: WithCustomId<MessageContextMenuCommandInteraction<Cache>>,
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