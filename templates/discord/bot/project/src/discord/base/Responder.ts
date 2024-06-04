import { log } from "#settings";
import { spaceBuilder } from "@magicyan/discord";
import ck from "chalk";
import { AnySelectMenuInteraction, ButtonInteraction, CacheType, ChannelSelectMenuInteraction, Collection, Interaction, MentionableSelectMenuInteraction, MessageComponentInteraction, ModalMessageModalSubmitInteraction, ModalSubmitInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from "discord.js";
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

type GetInteraction<T, C extends CacheType> = 
    T extends ResponderType.Row ? MessageComponentInteraction<C> :
    T extends ResponderType.Modal ? ModalSubmitInteraction<C> :
    T extends ResponderType.ModalComponent ? ModalMessageModalSubmitInteraction<C> :
    T extends ResponderType.Button ? ButtonInteraction<C> :
    T extends ResponderType.Select ? AnySelectMenuInteraction<C> :
    T extends ResponderType.StringSelect ? StringSelectMenuInteraction<C> :
    T extends ResponderType.UserSelect ? UserSelectMenuInteraction<C> :
    T extends ResponderType.RoleSelect ? RoleSelectMenuInteraction<C> :
    T extends ResponderType.ChannelSelect ? ChannelSelectMenuInteraction<C> :
    T extends ResponderType.MentionableSelect ? MentionableSelectMenuInteraction<C> :
    T extends ResponderType.All ? ButtonInteraction<C> | AnySelectMenuInteraction<C> | ModalSubmitInteraction<C> :
    never;

type ResponderData<I, T, C extends CacheType = CacheType> = {
    customId: I, type: T, cache?: C;
    run(interaction: GetInteraction<T, C>, params: Prettify<Params<I>>): void;
}
type SubItems = Collection<string, ResponderData<string, unknown, CacheType>>;
export class Responder<I extends string, T extends ResponderType, C extends CacheType>{
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
    public static sortCustomIds(){
        function hasParam(customId: string) {
            return customId.split("/").some(segment => segment.startsWith(":"));
        }
        function count(customId: string) {
            return customId.split("/").length;
        }
        type ResponderDataEntry = [string, ResponderData<string, unknown, CacheType>]
        function compareRoutes([customIdA]: ResponderDataEntry, [customIdB]: ResponderDataEntry) {
            const hasParamA = hasParam(customIdA);
            const hasParamB = hasParam(customIdB);
        
            if (hasParamA && !hasParamB) {
                return 1; 
            } else if (!hasParamA && hasParamB) {
                return -1; 
            }
            return count(customIdA) - count(customIdB);
        }

        for(const [type, subItems] of Responder.items){
            const entries = Array.from(subItems.entries());
            entries.sort(compareRoutes);
            Responder.items.set(type, new Collection(entries));
        }
    }
    public static onInteraction(interaction: Interaction){
        if (interaction.isCommand() || interaction.isAutocomplete()) return;
        const { customId } = interaction;

        const responderType = 
        interaction.isButton() ? ResponderType.Button : 
        interaction.isStringSelectMenu() ? ResponderType.StringSelect : 
        interaction.isChannelSelectMenu() ? ResponderType.ChannelSelect : 
        interaction.isRoleSelectMenu() ? ResponderType.RoleSelect : 
        interaction.isUserSelectMenu() ? ResponderType.UserSelect : 
        interaction.isMentionableSelectMenu() ? ResponderType.MentionableSelect : 
        interaction.isFromMessage() ? ResponderType.ModalComponent : 
        interaction.isModalSubmit() ? ResponderType.Modal : undefined;

        if (!responderType) return;

        const findSubItems = (type: ResponderType): SubItems | undefined => {
            if (type === ResponderType.All) return Responder.items.get(ResponderType.All);
            if (interaction.isAnySelectMenu()){
                if (type !== ResponderType.Select && type !== ResponderType.Row){
                    return Responder.items.get(ResponderType.Select) ?? findSubItems(ResponderType.Select);
                }
                if (type === ResponderType.Select){
                    return Responder.items.get(ResponderType.Row) ?? findSubItems(ResponderType.Row);
                }
            }
            if (interaction.isButton()){
                if (type !== ResponderType.Row){
                    return Responder.items.get(ResponderType.Row) ?? findSubItems(ResponderType.All);
                }
            }
            return findSubItems(ResponderType.All);
        };

        const findAndRun = (subItems: SubItems | undefined, type: ResponderType) => {
            if (!subItems) return;

            const responder = subItems.get(customId) ?? subItems.find(data => 
                !!getCustomIdParams(data.customId, customId)
            );

            if (responder){
                const params = getCustomIdParams(responder.customId, customId) ?? {};
                responder.run(interaction as never, params);
                return;
            }
            
            if (type === ResponderType.All) return;
            if (interaction.isAnySelectMenu()){
                if (type !== ResponderType.Select && type !== ResponderType.Row){
                    findAndRun(findSubItems(type), ResponderType.Select);
                    return;
                } 
                if (type === ResponderType.Select){
                    findAndRun(findSubItems(ResponderType.Select), ResponderType.Row);
                    return;
                }
                findAndRun(findSubItems(ResponderType.Row), ResponderType.All);
                return;
            }
            if (interaction.isButton()){
                if (type !== ResponderType.Row){
                    findAndRun(findSubItems(type), ResponderType.Row);
                    return;
                }
                findAndRun(findSubItems(ResponderType.Row), ResponderType.All);
                return;
            }
            findAndRun(findSubItems(ResponderType.All), ResponderType.All);
        };

        const subItems = Responder.items.get(responderType) ?? findSubItems(responderType);
        if (!subItems) return;
        findAndRun(subItems, responderType);
    }
}