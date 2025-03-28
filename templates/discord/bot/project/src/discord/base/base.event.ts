import { Client, ClientEvents, Collection } from "discord.js";
import { baseStorage } from "./base.storage.js";
import ck from "chalk";
import { EventPropData } from "./base.types.js";

export interface EventData<EventName extends keyof ClientEvents> {
    name: string; event: EventName; once?: boolean; tags?: string[];
    run(...args: ClientEvents[EventName]): Promise<void>;
}

type GenericEventData = EventData<keyof ClientEvents>;
export type EventsCollection = Collection<string, GenericEventData>;

export function baseRegisterEvents(client: Client){
    const eventHandlers = baseStorage.events.map((collection, event) => ({ 
        event, handlers: collection.map(e => ({ run: e.run, once: e.once, tags: e.tags })) 
    }));

    const { middleware, onError } = baseStorage.config.events;

    for(const { event, handlers } of eventHandlers){

        const onHandlers = handlers.filter(e => !e.once);
        const onceHandlers = handlers.filter(e => e.once);

        type GenericEventHandler = { run: (...args: any[]) => Promise<void>, tags?: string[] };

        const processHandlers = (eventHandlers: GenericEventHandler[]) => {
            return async (...args: any[]) => {
                const eventData = { name: event, args } as EventPropData;
                
                for (const { run, tags: eventTags } of eventHandlers) {
                    (async function() {
                        let block = false;
                        const blockFunction = (...tags: string[]) => {
                            if (tags && eventTags && tags.some(tag => eventTags.includes(tag))){
                                block = true;
                            }
                            if (!tags || tags.length < 1) block = true;
                        }
                        if (middleware) await middleware(eventData, blockFunction);
                        if (block) return;

                        const execution = run(...args);
                        if (onError) {
                            await execution.catch(error => onError(error, eventData));
                        } else {
                            await execution;
                        }
                    })();
                }
            };
        };

        client.on(event, processHandlers(onHandlers));
        client.once(event, processHandlers(onceHandlers));
    }
}

export function baseEventLog(data: GenericEventData){
    const u = ck.underline;
    baseStorage.loadLogs.events
    .push(`${ck.yellow(`☉ ${data.name}`)} ${ck.gray(">")} ${u.yellowBright(data.event)} ${ck.green(`event ✓`)}`)
};