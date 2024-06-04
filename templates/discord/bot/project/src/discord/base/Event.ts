import { log } from "#settings";
import chalk from "chalk";
import { Client, ClientEvents, Collection } from "discord.js";

interface EventData<EventName extends keyof ClientEvents> {
    name: string; event: EventName; once?: boolean;
    run(...args: ClientEvents[EventName]): void
}

export class Event<EventName extends keyof ClientEvents> {
    private static items = new Collection<keyof ClientEvents, Collection<string, EventData<any>>>();
    constructor(data: EventData<EventName>){
        const events = Event.items.get(data.event) ?? new Collection();
        events.set(data.name, data);
        Event.items.set(data.event, events);
    }
    public static register(client: Client){
        const eventHandlers = Event.items.map((collection, event) => {
            const handlers = collection.map(({ run, once }) => ({ run, once }));
            return { event, handlers };
        });

        for(const { event, handlers } of eventHandlers){
            client.on(event, (...args) => {
                handlers.forEach(({ run, once }) => !once && run(...args));
            });
            client.once(event, (...args) => {
                handlers.forEach(({ run, once }) => once && run(...args));
            });
        }
    }
    public static loadLogs(){
        for(const events of Event.items.values()){
            events.forEach(({ name }) => {
                log.success(chalk.green(`${chalk.yellow.underline(name)} event loaded successfully!`));
            });
        }
    }
}