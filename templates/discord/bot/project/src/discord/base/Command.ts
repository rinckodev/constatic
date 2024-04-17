import { log } from "#settings";
import { findCommand } from "@magicyan/discord";
import chalk from "chalk";
import { ApplicationCommandManager, ApplicationCommandType, AutocompleteInteraction, CacheType, ChatInputApplicationCommandData, ChatInputCommandInteraction, Client, Collection, CommandInteraction, MessageApplicationCommandData, MessageContextMenuCommandInteraction, UserApplicationCommandData, UserContextMenuCommandInteraction } from "discord.js";
import { Store } from "./utils/Store.js";

type CommandStore = Record<string | number, Store<any, any>>;
type Cache<D> = D extends false ? "cached" : CacheType;

type CommandName<N extends string> = 
	N extends "" ? never :
	N extends `${string} ${string}` ? never :
	N extends Lowercase<N> ? N : never;

type CommandProps<N extends string, D, T, S> = 
	T extends ApplicationCommandType.ChatInput ? ChatInputApplicationCommandData & {
		name: CommandName<N>;
		run(interaction: ChatInputCommandInteraction<Cache<D>>, store: S): void;
		autocomplete?(interaction: AutocompleteInteraction<Cache<D>>, store: S): void;
	} :
	T extends ApplicationCommandType.Message ? MessageApplicationCommandData & {
		name: N extends "" ? never : N;
		run(interaction: MessageContextMenuCommandInteraction<Cache<D>>, store: S): void;
	} :
	T extends ApplicationCommandType.User ? UserApplicationCommandData & {
		name: N extends "" ? never : N;
		run(interaction: UserContextMenuCommandInteraction<Cache<D>>, store: S): void;
	} : never;

type CommandData<N extends string, D, T, S> = {
	name: N; dmPermission: D; type: T; store?: S;
} & CommandProps<N, D, T, S>

type EssentialCommandData = {
	store: unknown;
	run(interaction: unknown, store: unknown): void
	autocomplete?(interaction: unknown, store: unknown): void
}

export class Command<N extends string, D extends boolean, T extends ApplicationCommandType, S extends CommandStore> {
	private static SlashCommands = new Collection<string, CommandData<any, any, any, any>>();
	private static Commands = new Collection<string, EssentialCommandData>();
	constructor(private readonly data: CommandData<N, D, T, S>){
		Command.SlashCommands.set(data.name, data);
		const commandData = data as EssentialCommandData;
		Command.Commands.set(data.name, {
			run: commandData.run,
			store: commandData.store,
			autocomplete: commandData.autocomplete
		});
	}
	public get store(){
		return this.data.store ?? {} as S;
	}
	public getApplicationCommand(client: Client<true>) {
		return findCommand(client).byName(this.data.name)!;
	}
	public static registerCommands(manager: ApplicationCommandManager){
		const commands = Array.from(Command.SlashCommands.values());
		Command.SlashCommands.clear();
		
		return manager.set(commands);
	}
	public static onCommand(interaction: CommandInteraction){
		const command = Command.Commands.get(interaction.commandName);
		if (command) {
			command.run(interaction as unknown, command.store);
			return;
		}
	}
	public static onAutocomplete(interaction: AutocompleteInteraction){
		const command = Command.Commands.get(interaction.commandName);
		if (!command) return;
		if ("autocomplete" in command && command.autocomplete){
			command.autocomplete(interaction, command.store);
		}
	}
	public static logs(){
		Command.Commands.forEach((_, name) => {
			log.success(chalk.green(`${chalk.blue.underline(name)} command registered successfully!`));
		});
	}
}