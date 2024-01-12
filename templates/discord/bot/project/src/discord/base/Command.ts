import { findCommand } from "@magicyan/discord";
import ck from "chalk";
import {
	ApplicationCommandData,
	ApplicationCommandType,
	AutocompleteInteraction,
	CacheType,
	ChatInputCommandInteraction,
	Client,
	Collection,
	MessageContextMenuCommandInteraction,
	UserContextMenuCommandInteraction
} from "discord.js";
import { log } from "#settings";

type CommandStoreData =
	| Map<any, any>
	| Set<any>
	| Collection<any, any>
	| Array<any>;

type CommandStore = Record<string, CommandStoreData>;

type GetCache<D> = D extends false ? "cached" : CacheType;

interface ChatInputCommandProps<D, Store> {
	name: Lowercase<string>;
	autoComplete?(
		interaction: AutocompleteInteraction<GetCache<D>>,
		store: Store
	): void;
	run(
		interaction: ChatInputCommandInteraction<GetCache<D>>,
		store: Store
	): void;
	type: ApplicationCommandType.ChatInput;
}
interface UserContextCommandProps<D, Store> {
	type: ApplicationCommandType.User;
	run(
		interaction: UserContextMenuCommandInteraction<GetCache<D>>,
		store: Store
	): void;
}
interface MessageContextCommandProps<D, Store> {
	type: ApplicationCommandType.Message;
	run(
		interaction: MessageContextMenuCommandInteraction<GetCache<D>>,
		store: Store
	): void;
}

type CommandProps<D, Store> =
	| ChatInputCommandProps<D, Store>
	| UserContextCommandProps<D, Store>
	| MessageContextCommandProps<D, Store>;

type CommandData<
	D extends boolean,
	Store extends CommandStore
> = ApplicationCommandData &
	CommandProps<D, Store> & {
		dmPermission?: D;
		store?: Store;
	};

export class Command<
	D extends boolean,
	Store extends CommandStore = CommandStore
> {
	public static commands: Collection<string, CommandData<boolean, any>> =
		new Collection();
	constructor(public readonly data: CommandData<D, Store>) {
		log.success(
			ck.green(
				`${ck.blue.underline(data.name)} command registered successfully!`
			)
		);
		Command.commands.set(data.name, data);
	}
	public getStore(): Store {
		return this.data.store ?? ({} as Store);
	}
	public getApplicationCommand(client: Client<true>) {
		return findCommand(client).byName(this.data.name)!;
	}
}
