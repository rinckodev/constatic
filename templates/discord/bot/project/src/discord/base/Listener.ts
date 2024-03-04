import ck from "chalk";
import { Client, ClientEvents } from "discord.js";
import { log } from "#settings";

type ListenerData<EventName extends keyof ClientEvents> = {
	name: EventName;
	once?: boolean;
	run(...args: ClientEvents[EventName]): void;
};

export class Listener<Key extends keyof ClientEvents> {
	constructor(data: ListenerData<Key>) {
		Listener.listeners.push(data);
	}
	private static listeners: ListenerData<keyof ClientEvents>[] = [];
	public static register(client: Client){
		for(const listener of Listener.listeners){ 
			listener.once 
			? client.once(listener.name, listener.run) 
			: client.on(listener.name, listener.run);
		}
	}
	public static logs(){
		Listener.listeners.forEach(({ name }) => {
			log.success(ck.green(`${ck.greenBright.underline(name)} listener registered successfully!`));
		});
	}
}