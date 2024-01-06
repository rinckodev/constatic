import { ButtonInteraction, CacheType, ChannelSelectMenuInteraction, Collection, ComponentType, MentionableSelectMenuInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from "discord.js";
import { log } from "#settings";
import ck from "chalk";

type ComponentProps<C extends CacheType = CacheType> = {
    type: ComponentType.Button,
    run(interaction: ButtonInteraction<C>): void;
} | {
    type: ComponentType.StringSelect,
    run(interaction: StringSelectMenuInteraction<C>): void;
} | {
    type: ComponentType.RoleSelect,
    run(interaction: RoleSelectMenuInteraction<C>): void;
} | {
    type: ComponentType.ChannelSelect,
    run(interaction: ChannelSelectMenuInteraction<C>): void;
} | {
    type: ComponentType.UserSelect,
    run(interaction: UserSelectMenuInteraction<C>): void;
} | {
    type: ComponentType.MentionableSelect,
    run(interaction: MentionableSelectMenuInteraction<C>): void;
}

type CustomIdFunction = (customId: string) => boolean

type ComponentStringIdentifier = {
    customId: string;
}
type ComponentFunctionIdentifier = {
    name: string;
    customId: CustomIdFunction;
}

type ComponentIdentifier = ComponentStringIdentifier | ComponentFunctionIdentifier

type ComponentData<C extends CacheType = CacheType> = ComponentProps<C> & ComponentIdentifier & {
    cache?: C
}

export class Component<C extends CacheType = CacheType> {
    private static components: Collection<string, ComponentData> = new Collection();
    public static get<T extends ComponentType>(customId: string, type: T){
        return Component.components.find(c => c.customId === customId && c.type === type) || 
        Component.logical.find(c => c.customId(customId) && c.type === type);
    }
    public static logical: Array<ComponentData & { customId: CustomIdFunction }> = [];
    constructor(data: ComponentData<C>){
        if (typeof data.customId === "string"){
            Component.components.set(data.customId, data);
            log.success(ck.green(`${ck.cyan.underline(data.customId)} component registered successfully!`));
        } else {
            Component.logical.push(data as any);
            const name = (data as { name: string }).name;
            log.success(ck.green(`${ck.cyan.underline(name)} component registered successfully!`));
        }
    }
}