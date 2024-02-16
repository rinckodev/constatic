import ck from "chalk";
import { Client, ClientEvents } from "discord.js";
import { log } from "#settings";

type EventData<Key extends keyof ClientEvents> = {
	name: Key;
	once?: boolean;
	run(...args: ClientEvents[Key]): void;
};

export class Event<Key extends keyof ClientEvents> {
	public static events: EventData<keyof ClientEvents>[] = [];
	public static register(client: Client){
		for(const event of Event.events){ 
			event.once 
			? client.once(event.name, event.run) 
			: client.on(event.name, event.run);
		}
	}
	constructor(data: EventData<Key>) {
		Event.events.push(data);
		log.success(ck.green(`${ck.yellow.underline(data.name)} event registered successfully!`));
	}
}