import { Client, ClientEvents, Collection } from "discord.js";
import { baseStorage } from "./base.storage.js";
import ck from "chalk";

export interface EventData<EventName extends keyof ClientEvents> {
    name: string; event: EventName; once?: boolean;
    run(...args: ClientEvents[EventName]): void
}

type GenericEventData = EventData<keyof ClientEvents>;
export type EventsCollection = Collection<string, GenericEventData>;

export function baseRegisterEvents(client: Client){
    const eventHandlers = baseStorage.events.map((collection, event) => ({ 
        event, handlers: collection.map(e => ({ run: e.run, once: e.once })) 
    }));

    for(const { event, handlers } of eventHandlers){

        const onHandlers = handlers.filter(e => !e.once);
        const onceHandlers = handlers.filter(e => e.once);

        client.on(event, (...args) => {
            for(const { run } of onHandlers) run(...args);
        });
        client.once(event, (...args) => {
            for(const { run } of onceHandlers) run(...args);
        });
    }
}

export function baseEventLog(data: GenericEventData){
    baseStorage.loadLogs.events
    .push(ck.green(`${ck.greenBright.underline(`${data.event}`)} ${ck.yellow.underline(data.name)} event loaded!`));
};