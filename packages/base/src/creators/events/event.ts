import type { ClientEvents } from "discord.js";

export type ClientEventKey = keyof ClientEvents;

export type EventPropData = {
    [Key in ClientEventKey]: {
        name: Key;
        args: ClientEvents[Key]
    }
}[ClientEventKey]

export interface EventData<EventName extends ClientEventKey> {
    name: string; 
    event: EventName; 
    once?: boolean; 
    tags?: string[];
    run(this: void, ...args: ClientEvents[EventName]): Promise<void>;
}

export class Event<EventName extends ClientEventKey> {
    constructor(
        public readonly data: EventData<EventName>
    ){}
}

export type GenericEventArgs = ClientEvents[ClientEventKey];
export type EventsCollection = Map<string, Event<ClientEventKey>>;

