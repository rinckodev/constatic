import { log } from "#settings";
import { findCommand } from "@magicyan/discord";
import ck from "chalk";
import { ApplicationCommandType, AutocompleteInteraction, CacheType, ChatInputApplicationCommandData, ChatInputCommandInteraction, Client, Collection, CommandInteraction, Guild, MessageApplicationCommandData, MessageContextMenuCommandInteraction, UserApplicationCommandData, UserContextMenuCommandInteraction } from "discord.js";
import { Store } from "./utils/Store.js";

interface CommandStore extends Record<string | number, Store<any, any>> {}
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

type CommandData<N extends string, D, T, S> = CommandProps<N, D, T, S> & {
	name: N; dmPermission: D; type: T; store?: S; global?: boolean;
}

export class Command<N extends string, D extends boolean, T extends ApplicationCommandType, S extends CommandStore> {
	private static Commands = new Collection<string, CommandData<any, any, any, any>>();
	constructor(private readonly data: CommandData<N, D, T, S>){
		Command.Commands.set(data.name, data);
	}
	public get store(){
		return this.data.store ?? {} as S;
	}
	public getApplicationCommand(client: Client<true>) {
		return findCommand(client).byName(this.data.name)!;
	}
	private static log(text: string){
		return log.success(ck.green(text));
	}
	private static clearGuildCommands(client: Client<true>){
		const guilds = client.guilds.cache.filter(g => g.commands.cache.size >= 1);
		for(const guild of guilds.values()){
			guild.commands.set([]);
		}
	}
	public static async registerGlobalCommands(client: Client<true>){
		Command.clearGuildCommands(client);

		client.application.commands.set(Array.from(Command.Commands.values()))
		.then(({ size }) => 
			Command.log(`${size} commands successfully registered globally!`)
		);
	}
	public static async registerGuildCommands(client: Client<true>, guilds: Collection<string, Guild>){
		const [globalCommands, guildCommads] = Command.Commands.partition(c => c.global === true);

		Command.clearGuildCommands(client);

		client.application.commands.set(Array.from(globalCommands.values()))
		.then(({ size }) => 
			Command.log(`${size} commands successfully registered globally!`)
		);
		for(const guild of guilds.values()){
			guild.commands.set(Array.from(guildCommads.values()))
			.then(({ size }) => 
				Command.log(`${size} commands registered in ${ck.underline(guild.name)} guild successfully!`)
			);
		}
	}
	public static onCommand(interaction: CommandInteraction){
		const command = Command.Commands.get(interaction.commandName);
		if (!command) return;
		command.run(interaction as never, command.store);
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
			log.success(ck.green(`${ck.blue.underline(name)} command loaded successfully!`));
		});
	}
}