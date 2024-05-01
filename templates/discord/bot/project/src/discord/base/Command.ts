import { log } from "#settings";
import { findCommand } from "@magicyan/discord";
import ck from "chalk";
import { ApplicationCommandType, AutocompleteInteraction, CacheType, ChatInputApplicationCommandData, ChatInputCommandInteraction, Client, Collection, CommandInteraction, Guild, MessageApplicationCommandData, MessageContextMenuCommandInteraction, UserApplicationCommandData, UserContextMenuCommandInteraction } from "discord.js";

type Cache<D> = D extends false ? "cached" : CacheType;

type CommandName<N extends string> = 
	N extends "" ? never :
	N extends `${string} ${string}` ? never :
	N extends Lowercase<N> ? N : never;

type CommandProps<N extends string, D, T> = 
	T extends ApplicationCommandType.ChatInput ? ChatInputApplicationCommandData & {
		name: CommandName<N>;
		run(interaction: ChatInputCommandInteraction<Cache<D>>): void;
		autocomplete?(interaction: AutocompleteInteraction<Cache<D>>): void;
	} :
	T extends ApplicationCommandType.Message ? MessageApplicationCommandData & {
		name: N extends "" ? never : N;
		run(interaction: MessageContextMenuCommandInteraction<Cache<D>>): void;
	} :
	T extends ApplicationCommandType.User ? UserApplicationCommandData & {
		name: N extends "" ? never : N;
		run(interaction: UserContextMenuCommandInteraction<Cache<D>>): void;
	} : never;

type CommandData<N extends string, D, T> = CommandProps<N, D, T> & {
	name: N; dmPermission: D; type: T; global?: boolean;
}

export class Command<N extends string, D extends boolean, T extends ApplicationCommandType> {
	private static Commands = new Collection<string, CommandData<any, any, any>>();
	constructor(private readonly data: CommandData<N, D, T>){
		Command.Commands.set(data.name, data);
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
		command.run(interaction as never);
	}
	public static onAutocomplete(interaction: AutocompleteInteraction){
		const command = Command.Commands.get(interaction.commandName);
		if (!command) return;
		if ("autocomplete" in command && command.autocomplete){
			command.autocomplete(interaction);
		}
	}
	public static logs(){
		Command.Commands.forEach((_, name) => {
			log.success(ck.green(`{/} ${ck.blue.underline(name)} command loaded successfully!`));
		});
	}
}