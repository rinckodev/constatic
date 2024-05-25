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

type CommandData<N extends string, T, D extends boolean = true> = CommandProps<N, D, T> & {
	name: N; dmPermission?: D; type: T; global?: boolean;
}

export class Command<N extends string, T extends ApplicationCommandType, D extends boolean = false> {
	private static items = new Collection<string, CommandData<any, any, any>>();
	constructor(private readonly data: CommandData<N, T, D>){
		data.dmPermission??=false as D;
		Command.items.set(data.name, data);
	}
	public getApplicationCommand(client: Client<true> | Guild) {
		return findCommand(client).byName(this.data.name)!;
	}
	private static clearGuildCommands(client: Client<true>){
		const guilds = client.guilds.cache;
		for(const guild of guilds.values()){
			guild.commands.set([]);
		}
	}
	public static async register(addMessage: Function, client: Client<true>, guilds?: Collection<string, Guild>){
		Command.clearGuildCommands(client);

		if (guilds){
			const [globalCommands, guildCommads] = Command.items.partition(c => c.global === true);
			await client.application.commands.set(Array.from(globalCommands.values()))
			.then(({ size }) => 
				addMessage(`⤿ ${size} commands successfully registered globally!`)
			);
			for (const guild of guilds.values()){
				await guild.commands.set(Array.from(guildCommads.values()))
				.then(({ size }) => 
					addMessage(`⤿ ${size} commands registered in ${ck.underline(guild.name)} guild successfully!`)
				);
			}
			return;
		}
		await client.application.commands.set(Array.from(Command.items.values()))
		.then(({ size }) => 
			addMessage(`⤿ ${size} commands successfully registered globally!`)
		);
	}
	public static onCommand(interaction: CommandInteraction){
		const command = Command.items.get(interaction.commandName);
		if (!command) return;
		command.run(interaction as never);
	}
	public static onAutocomplete(interaction: AutocompleteInteraction){
		const command = Command.items.get(interaction.commandName);
		if (!command) return;
		if ("autocomplete" in command && command.autocomplete){
			command.autocomplete(interaction);
		}
	}
	public static loadLogs(){
		for(const [name] of Command.items){
			log.success(ck.green(`{/} ${ck.blue.underline(name)} command loaded successfully!`));
		}
	}
}