import { log } from "#settings";
import chalk from "chalk";
import { CacheType, Collection, ComponentType, Interaction, MessageComponentInteraction } from "discord.js";
import { getCustomIdParams, Params } from "./utils.js";

type MessageComponentType = Exclude<ComponentType, ComponentType.ActionRow | ComponentType.TextInput>

type GetComponentInteraction<T, C extends CacheType> = 
	Extract<Interaction<C>, { componentType: T }>

type ComponentInteraction<T, C extends CacheType> = {
	interaction: GetComponentInteraction<T, C>
} & GetComponentInteraction<T, C>

type ComponentData<I extends string, T, C extends CacheType = CacheType> = {
    customId: I; type: T; cache?: C;
	run(interaction: ComponentInteraction<T, C>, params: Params<I>): void
}

export class Component<I extends string, T extends MessageComponentType, C extends CacheType> {
	private static components = new Collection<ComponentType, Collection<string, ComponentData<any, any, any>>>(); 
    constructor(data: ComponentData<I, T, C>){
        const components = Component.components.get(data.type) ?? new Collection();
        components.set(data.customId, data);
        Component.components.set(data.type, components);
		log.success(chalk.green(`${chalk.cyan.underline(data.customId)} component registered successfully!`));
	}
    public static onComponent(interaction: MessageComponentInteraction){
        const { customId, componentType } = interaction;
        
        const components = Component.components.get(componentType);
        if (!components) return;

        if (components.has(customId)){
            const component = components.get(customId)!;
            component.run(interaction as any, null);
            return;
        }
        
        const component = components.find((data) => !!getCustomIdParams(data.customId, customId));
        if (!component) return;
        const params = getCustomIdParams(component.customId, customId);
        component.run(interaction as any, params);

    }
}