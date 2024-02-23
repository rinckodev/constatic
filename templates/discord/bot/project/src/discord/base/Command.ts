import { ApplicationCommandType, CacheType, ChatInputCommandInteraction, Collection, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction, ChatInputApplicationCommandData, MessageApplicationCommandData, UserApplicationCommandData, Client, AutocompleteInteraction, CommandInteraction } from "discord.js";
import { findCommand } from "@magicyan/discord";
import { Store } from "./Store.js";
import { log } from "#settings";
import chalk from "chalk";

type Cache<D> = D extends false ? "cached" : CacheType;

type CommandProps<N extends string, D extends boolean, T extends ApplicationCommandType, S extends CommandStore> = 
	T extends ApplicationCommandType.ChatInput ? ChatInputApplicationCommandData & {
		name: N extends Lowercase<N> ? N : never;
		run(interaction: ChatInputCommandInteraction<Cache<D>>, store: S): void;
		autocomplete?(interaction: AutocompleteInteraction<Cache<D>>, store: S): void;
	} :
	T extends ApplicationCommandType.Message ? MessageApplicationCommandData & {
		run(interaction: MessageContextMenuCommandInteraction<Cache<D>>, store: S): void;
	} :
	T extends ApplicationCommandType.User ? UserApplicationCommandData & {
		run(interaction: UserContextMenuCommandInteraction<Cache<D>>, store: S): void;
	} : never;

type CommandStore = Record<string | number, Store<any, any>>;

type CommandData<N extends string, D extends boolean, T extends ApplicationCommandType, S extends CommandStore> = {
	name: N; dmPermission: D; type: T; store?: S;  
} & CommandProps<N, D, T, S>

export class Command<N extends string, D extends boolean, T extends ApplicationCommandType, S extends CommandStore> {
	public static commands = new Collection<string, CommandData<any, any, any, any>>();
	constructor(private readonly data: CommandData<N, D, T, S>){
		Command.commands.set(data.name, data);
	}
	public get store(){
		return this.data.store ?? {} as S;
	}
	public getApplicationCommand(client: Client<true>) {
		return findCommand(client).byName(this.data.name)!;
	}
	public static onCommand(interaction: CommandInteraction){
		const command = Command.commands.get(interaction.commandName);
		if (command) {
			command.run(interaction as never, command.store);
			return;
		}
	}
	public static onAutocomplete(interaction: AutocompleteInteraction){
		const command = Command.commands.get(interaction.commandName);
		if (command?.type !== ApplicationCommandType.ChatInput) return;
		if ("autocomplete" in command && command.autocomplete){
			command.autocomplete(interaction, command.store);
		}
	}
	public static logs(){
		Command.commands.forEach(({ name }) => {
			log.success(chalk.green(`${chalk.blue.underline(name)} command registered successfully!`));
		});
	}
}