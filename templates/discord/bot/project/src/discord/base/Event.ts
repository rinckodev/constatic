import { log } from "#settings";
import chalk from "chalk";
import { Client, ClientEvents, Collection } from "discord.js";

interface EventData<EventName extends keyof ClientEvents> {
    name: string;
    description?: string;
    event: EventName;
    once?: boolean;
    run(...args: ClientEvents[EventName]): void
}

export class Event<EventName extends keyof ClientEvents> {
    private static Events = new Collection<keyof ClientEvents, Collection<string, EventData<any>>>();
    constructor(data: EventData<EventName>){
        const events = Event.Events.get(data.event) ?? new Collection();
        events.set(data.name, data);
		log.success(chalk.green(`${chalk.yellow.underline(data.name)} event registered successfully!`));

        Event.Events.set(data.event, events);
    }
    public static register(client: Client){

        const eventHandlers = Event.Events.map((collection, event) => {
            const handlers = collection.map(({ run, once }) => ({ run, once }));
            return { event, handlers };
        });

        for(const { event, handlers } of eventHandlers){
            
            client.on(event, (...args) => {
                handlers.forEach(({ run, once }) => !once && run(...args));
            });
            client.on(event, (...args) => {
                handlers.forEach(({ run, once }) => once && run(...args));
            });
        }
    }
}