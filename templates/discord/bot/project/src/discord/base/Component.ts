import { log } from "#settings";
import chalk from "chalk";
import { CacheType, Collection, ComponentType, Interaction, MessageComponentInteraction } from "discord.js";
import { getCustomIdParams, Params, Prettify } from "./utils/Params.js";
import { spaceBuilder } from "@magicyan/discord";

type MessageComponentType = Exclude<ComponentType, ComponentType.TextInput>

type ComponentInteraction<T, C extends CacheType> = T extends ComponentType.ActionRow 
    ? MessageComponentInteraction<C> 
    : Extract<Interaction<C>, { componentType: T }>

type ComponentData<I extends string, T, C extends CacheType = CacheType> = {
    customId: I; type: T; cache?: C;
	run(interaction: ComponentInteraction<T, C>, params: Prettify<Params<I>>): void
}

export class Component<I extends string, T extends MessageComponentType, C extends CacheType> {
	private static components = new Collection<ComponentType, Collection<string, ComponentData<any, any, any>>>(); 
    constructor(data: ComponentData<I, T, C>){
        const components = Component.components.get(data.type) ?? new Collection();
        components.set(data.customId, data);
        Component.components.set(data.type, components);
	}
    public static onComponent(interaction: MessageComponentInteraction){
        const { customId, componentType } = interaction;
        
        const components = Component.components.get(componentType) 
        ?? Component.components.get(ComponentType.ActionRow);

        const find = (components: Collection<string, ComponentData<any, any, any>> | undefined, type: ComponentType) => {
            if (!components) return;

            if (components.has(customId)){
                const component = components.get(customId)!;
                component.run(interaction as never, null);
                return;
            }
            const component = components.find((data) => !!getCustomIdParams(data.customId, customId));
            if (component){
                const params = getCustomIdParams(component.customId, customId);
                component.run(interaction as never, params as never);
                return;
            }
            
            if (type !== ComponentType.ActionRow){
                find(Component.components.get(ComponentType.ActionRow), ComponentType.ActionRow);
            }
        };

        find(components, componentType);
    }
    public static logs(){
        const names = new Map(Object.entries(ComponentType).filter(Boolean).map(e => [+e[0], e[1]]));

        for(const components of Component.components.values()){

            for(const { customId, type } of components.values()){
                const text = spaceBuilder(
                    chalk.greenBright.underline(names.get(type)),
                    chalk.blue.underline(customId),
                    "component loaded successfully!"
                );
                log.success(chalk.green(text));
            }
        }
	}
}