import type { ClientEvents, Collection } from "discord.js";

export type ClientEventKey = keyof ClientEvents;

export type EventPropData = {
    [Key in ClientEventKey]: {
        name: Key;
        args: ClientEvents[Key]
    }
}[ClientEventKey]

export interface EventData<EventName extends ClientEventKey> {
    name: string; event: EventName; once?: boolean; tags?: string[];
    run(this: void, ...args: ClientEvents[EventName]): Promise<void>;
}

export type GenericEventArgs = ClientEvents[ClientEventKey];
export type GenericEventData = EventData<ClientEventKey>;

export type EventsCollection = Collection<string, GenericEventData>;