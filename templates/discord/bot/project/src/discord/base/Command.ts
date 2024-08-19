import { log } from "#settings";
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

type CommandData<N extends string, T, D> = CommandProps<N, D, T> & {
	name: N; dmPermission?: D; type?: T; global?: boolean;
}

interface CommandHandler {
	run(interaction: CommandInteraction): void
	autocomplete?(interaction: AutocompleteInteraction): void;
}

export class Command<
	N extends string,
	T extends ApplicationCommandType = ApplicationCommandType.ChatInput, 
	D extends boolean = false
> {
	private static Handlers = new Collection<string, CommandHandler>();
	private static Commands = new Collection<string, CommandData<any, any, any>>();
	constructor(data: CommandData<N, T, D>){
		data.dmPermission??=false as D;
		data.type??=ApplicationCommandType.ChatInput as T;
		Command.Commands.set(data.name, data);
		Command.Handlers.set(data.name, { 
			run: data.run, autocomplete: "autocomplete" in data ? data.autocomplete : undefined 
		});
	}
	public static async register(addMessage: Function, client: Client<true>, guilds?: Collection<string, Guild>){
		const plural = (value: number) => value > 1 ? "s" : "";
		
		if (guilds?.size){
			const [globalCommands, guildCommads] = Command.Commands.partition(c => c.global === true);
			await client.application.commands.set(Array.from(globalCommands.values()))
			.then(({ size }) => Boolean(size) &&
				addMessage(`⤿ ${size} command${plural(size)} successfully registered globally!`)
			);
			for (const guild of guilds.values()){
				await guild.commands.set(Array.from(guildCommads.values()))
				.then(({ size }) => 
					addMessage(`⤿ ${size} command${plural(size)} registered in ${ck.underline(guild.name)} guild successfully!`)
				);
			}
			Command.Commands.clear();
			return;
		}
		for(const guild of client.guilds.cache.values()){
			guild.commands.set([]);
		}
		await client.application.commands.set(Array.from(Command.Commands.values()))
		.then(({ size }) => 
			addMessage(`⤿ ${size} command${plural(size)} successfully registered globally!`)
		);
		Command.Commands.clear();
	}
	public static onCommand(interaction: CommandInteraction){
		const command = Command.Handlers.get(interaction.commandName);
		if (!command) return;
		command.run(interaction as never);
	}
	public static onAutocomplete(interaction: AutocompleteInteraction){
		const command = Command.Handlers.get(interaction.commandName);
		if (!command || !command.autocomplete) return;
		command.autocomplete(interaction);
	}
	public static loadLogs(){
		for(const [name] of Command.Commands){
			log.success(ck.green(`{/} ${ck.blue.underline(name)} command loaded!`));
		}
	}
}