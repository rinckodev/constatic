import { log } from "#settings";
import chalk from "chalk";
import { Client, ClientEvents, Collection } from "discord.js";

interface EventData<EventName extends keyof ClientEvents> {
    name: string; event: EventName; once?: boolean;
    run(...args: ClientEvents[EventName]): void
}
type EventCollection = Collection<string, EventData<keyof ClientEvents>>;

export class Event<EventName extends keyof ClientEvents> {
    private static items = new Collection<keyof ClientEvents, EventCollection>();
    constructor(data: EventData<EventName>){
        const events = Event.items.get(data.event) ?? new Collection();
        events.set(data.name, data);
        Event.items.set(data.event, events);
    }
    public static register(client: Client){
        const eventHandlers = Event.items.map((collection, event) => ({ 
            event, handlers: collection.map(e => ({ run: e.run, once: e.once })) 
        }));

        for(const { event, handlers } of eventHandlers){
            client.on(event, (...args) => {
                for(const { run } of handlers.filter(e => !e.once)) run(...args);
            });
            client.once(event, (...args) => {
                for(const { run } of handlers.filter(e => e.once)) run(...args);
            });
        }
    }
    public static loadLogs(){
        for(const events of Event.items.values()){
            for(const { name } of events.values()){
                log.success(chalk.green(`${chalk.yellow.underline(name)} event loaded!`));
            }
        }
    }
}