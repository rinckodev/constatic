import { Client, ClientEvents, Collection } from "discord.js";
import { baseStorage } from "./base.storage.js";
import ck from "chalk";
import { EventPropData } from "./base.types.js";

export interface EventData<EventName extends keyof ClientEvents> {
    name: string; event: EventName; once?: boolean; tags?: string[];
    run(...args: ClientEvents[EventName]): Promise<void>;
}

type GenericEventArgs = ClientEvents[keyof ClientEvents];
type GenericEventData = EventData<keyof ClientEvents>;

export type EventsCollection = Collection<string, GenericEventData>;

export function baseRegisterEvents(client: Client){
    const collection = baseStorage.events.filter((_,key) => key !== "ready");

    for(const [key, events] of collection.entries()){
        client.on(key, (...args) => {
            for(const data of events.values()){
                baseEventHandler(data, args);
            }
        });
    }
}

export async function baseEventHandler(data: GenericEventData, args: GenericEventArgs){
    const { middleware, onError } = baseStorage.config.events;

    let isBlock = false;
    const tags = data.tags??[];
    const block = (...selected: string[]) => {
        if (selected.length>=1 && selected.some(tag => tags.includes(tag))){
            isBlock = true;
        }
        if (tags.length < 1) isBlock = true;
    }

    const eventData = { name: data.event, args } as EventPropData;

    if (middleware) await middleware(eventData, block);
    if (isBlock) return;

    await data.run(...args)
    .catch(err => {
        if (onError){
            onError(err, eventData);
            return;
        }
        throw err;
    });
    
    if (data.once){
        baseStorage.events.get(data.event)?.delete(data.name);
    };
}

export function baseEventLog(data: GenericEventData){
    const u = ck.underline;
    baseStorage.loadLogs.events
    .push(`${ck.yellow(`☉ ${data.name}`)} ${ck.gray(">")} ${u.yellowBright(data.event)} ${ck.green(`event ✓`)}`)
};