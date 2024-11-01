import { log } from "#settings";
import ck from "chalk";
import { ApplicationCommandType, AutocompleteInteraction, CacheType, ChatInputApplicationCommandData, ChatInputCommandInteraction, Client, Collection, CommandInteraction, Guild, MessageApplicationCommandData, MessageContextMenuCommandInteraction, PermissionResolvable, UserApplicationCommandData, UserContextMenuCommandInteraction } from "discord.js";

type Cache<D> = D extends false ? "cached" : CacheType;

type CommandType = Exclude<ApplicationCommandType, ApplicationCommandType.PrimaryEntryPoint>;

type ContextName<N> = N extends "" ? never : N;

type SlashName<N> = 
	N extends "" ? never :
	N extends `${string} ${string}` ? never :
	N extends string 
		? N extends Lowercase<N> ? N : never 
		: never;

type CommandProps<N, D, T> = 
	T extends ApplicationCommandType.ChatInput ? ChatInputApplicationCommandData & {
		name: SlashName<N>;
		run(interaction: ChatInputCommandInteraction<Cache<D>>): void;
		autocomplete?(interaction: AutocompleteInteraction<Cache<D>>): void;
	} :
	T extends ApplicationCommandType.Message ? MessageApplicationCommandData & {
		name: ContextName<N>;
		run(interaction: MessageContextMenuCommandInteraction<Cache<D>>): void;
	} :
	T extends ApplicationCommandType.User ? UserApplicationCommandData & {
		name: ContextName<N>;
		run(interaction: UserContextMenuCommandInteraction<Cache<D>>): void;
	} : never;

type CommandData<N, T extends CommandType, D> = CommandProps<N, D, T> & {
	name: N; dmPermission?: D; 
	type?: T; global?: boolean;
}

interface CommandHandler {
	run(interaction: CommandInteraction): void
	autocomplete?(interaction: AutocompleteInteraction): void;
}

type CommandCollection = Collection<string, CommandData<any, any, any>>;

export class Command<
	N extends string,
	T extends CommandType = ApplicationCommandType.ChatInput,
	D extends boolean = false
> {
	private static handlers = new Collection<string, CommandHandler>();
	private static commands: CommandCollection = new Collection();
	constructor(public readonly data: CommandData<N, T, D>) {
		data.dmPermission ??= false as D;
		data.type ??= ApplicationCommandType.ChatInput as T;
		Command.commands.set(data.name, data);
		Command.handlers.set(data.name, {
			run: data.run,
			autocomplete: "autocomplete" in data
				? data.autocomplete : undefined
		});
	}
	public static async register(options: CommandRegisterOptions) {
		const { addMessage, client, guilds, defaultMemberPermissions } = options;

		if (defaultMemberPermissions){
			Command.commands.forEach(command => 
				command.defaultMemberPermissions??=defaultMemberPermissions
			);
		}

		const plural = (value: number) => value > 1 ? "s" : "";
		if (guilds?.size) {
			const [globalCommands, guildCommads] = Command.commands.partition(c => c.global === true);
			await client.application.commands.set(Array.from(globalCommands.values()))
				.then(({ size }) => Boolean(size) &&
					addMessage(`⤿ ${size} command${plural(size)} successfully registered globally!`)
				);
			for (const guild of guilds.values()) {
				await guild.commands.set(Array.from(guildCommads.values()))
					.then(({ size }) =>
						addMessage(`⤿ ${size} command${plural(size)} registered in ${ck.underline(guild.name)} guild successfully!`)
					);
			}
			Command.commands.clear();
			return;
		}
		for (const guild of client.guilds.cache.values()) {
			guild.commands.set([]);
		}
		await client.application.commands.set(Array.from(Command.commands.values()))
			.then(({ size }) =>
				addMessage(`⤿ ${size} command${plural(size)} successfully registered globally!`)
			);
		Command.commands.clear();
	}
	public static onCommand(interaction: CommandInteraction) {
		const command = Command.handlers.get(interaction.commandName);
		if (!command) return;
		command.run(interaction as never);
	}
	public static onAutocomplete(interaction: AutocompleteInteraction) {
		const command = Command.handlers.get(interaction.commandName);
		if (!command || !command.autocomplete) return;
		command.autocomplete(interaction);
	}
	public static loadLogs() {
		for (const [name] of Command.commands) {
			log.success(ck.green(`{/} ${ck.blue.underline(name)} command loaded!`));
		}
	}
}

interface CommandRegisterOptions {
	addMessage: Function,
	client: Client<true>,
	guilds?: Collection<string, Guild>,
	defaultMemberPermissions?: PermissionResolvable[]
}