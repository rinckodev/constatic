import ck from "chalk";
import { Client, ClientEvents } from "discord.js";
import { log } from "#settings";

type ListenerData<EventName extends keyof ClientEvents> = {
	name: EventName;
	once?: boolean;
	run(...args: ClientEvents[EventName]): void;
};

export class Listener<Key extends keyof ClientEvents> {
	private static listeners: ListenerData<keyof ClientEvents>[] = [];
	public static register(client: Client){
		for(const event of Listener.listeners){ 
			event.once 
			? client.once(event.name, event.run) 
			: client.on(event.name, event.run);
		}
	}
	constructor(data: ListenerData<Key>) {
		Listener.listeners.push(data);
		log.success(ck.green(`${ck.greenBright.underline(data.name)} listener registered successfully!`));
	}
}