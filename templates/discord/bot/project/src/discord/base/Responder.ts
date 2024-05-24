import { log } from "#settings";
import { spaceBuilder } from "@magicyan/discord";
import ck from "chalk";
import { AnySelectMenuInteraction, ButtonInteraction, ChannelSelectMenuInteraction, Collection, Interaction, MentionableSelectMenuInteraction, MessageComponentInteraction, ModalMessageModalSubmitInteraction, ModalSubmitInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from "discord.js";
import { getCustomIdParams, Params, Prettify } from "./utils/Params.js";

export enum ResponderType {
    Row="Row",
    Modal="Modal",
    ModalComponent="Modal component",
    Button="Button",
    Select="Select menu",
    StringSelect="String select menu",
    UserSelect="User select menu",
    RoleSelect="Role select menu",
    ChannelSelect="Channel select menu",
    MentionableSelect="Mentionable select menu",
    All="Component or modal"
}

type GetInteraction<T> = 
    T extends ResponderType.Row ? MessageComponentInteraction :
    T extends ResponderType.Modal ? ModalSubmitInteraction :
    T extends ResponderType.ModalComponent ? ModalMessageModalSubmitInteraction :
    T extends ResponderType.Button ? ButtonInteraction :
    T extends ResponderType.Select ? AnySelectMenuInteraction :
    T extends ResponderType.StringSelect ? StringSelectMenuInteraction :
    T extends ResponderType.UserSelect ? UserSelectMenuInteraction :
    T extends ResponderType.RoleSelect ? RoleSelectMenuInteraction :
    T extends ResponderType.ChannelSelect ? ChannelSelectMenuInteraction :
    T extends ResponderType.MentionableSelect ? MentionableSelectMenuInteraction :
    T extends ResponderType.All ? ButtonInteraction | AnySelectMenuInteraction | ModalSubmitInteraction :
    never;

type ResponderData<I, T, C> = {
    customId: I, type: T, cache?: C;
    run(interaction: GetInteraction<T>, params: Prettify<Params<I>>): void;
}
type SubItems = Collection<string, ResponderData<string, unknown, unknown>>;
export class Responder<I extends string, T extends ResponderType, C>{
    private static items: Collection<ResponderType, SubItems> = new Collection();
    constructor(data: ResponderData<I, T, C>){
        const subitems = Responder.items.get(data.type) ?? new Collection();
        subitems.set(data.customId, data);
        Responder.items.set(data.type, subitems);
    }
    public static loadLogs(){
        for(const subitems of Responder.items.values()){

            for(const { customId, type } of subitems.values()){
                const text = spaceBuilder(
                    ck.greenBright.underline(type),
                    ck.blue.underline(customId),
                    "responder loaded successfully!"
                );
                log.success(ck.green(text));
            }
        }
    }
    public static onInteraction(interaction: Interaction){
        if (interaction.isCommand() || interaction.isAutocomplete()) return;

        const responderType = 
        interaction.isButton() ? ResponderType.Button : 
        interaction.isStringSelectMenu() ? ResponderType.StringSelect : 
        interaction.isChannelSelectMenu() ? ResponderType.ChannelSelect : 
        interaction.isRoleSelectMenu() ? ResponderType.RoleSelect : 
        interaction.isUserSelectMenu() ? ResponderType.UserSelect : 
        interaction.isMentionableSelectMenu() ? ResponderType.MentionableSelect : 
        interaction.isFromMessage() ? ResponderType.ModalComponent : 
        interaction.isModalSubmit() ? ResponderType.ModalComponent : undefined;

        const findSubItem = (type: ResponderType): SubItems | undefined => {
            if (interaction.isAnySelectMenu()){
                if (type === ResponderType.Select){
                    return Responder.items.get(ResponderType.Select) ?? findSubItem(ResponderType.Row);
                }
                if (type === ResponderType.Row){
                    return Responder.items.get(ResponderType.Row) ?? findSubItem(ResponderType.All);
                }
            }
            if (interaction.isButton()){
                if (type !== ResponderType.All){
                    return Responder.items.get(ResponderType.Row) ?? findSubItem(ResponderType.All);
                }
            }
            return Responder.items.get(ResponderType.All);
        };


        const find = (subitems: SubItems, type: ResponderType) => {
            if (subitems.has(interaction.customId)){
                const component = subitems.get(interaction.customId)!;
                component.run(interaction as never, {});
                return;
            }
            const component = subitems.find(
                (data) => !!getCustomIdParams(data.customId, interaction.customId)
            );
            if (component){
                const params = getCustomIdParams(component.customId, interaction.customId);
                component.run(interaction as never, params??{});
                return;
            }
            {
                const subitems = findSubItem(type);
                if (!subitems) return;
                find(subitems, type);
            }
        };

        if (!responderType) return;
        const subitems = Responder.items.get(responderType) ?? findSubItem(responderType);
        if (!subitems) return;
        find(subitems, responderType);
    }
}