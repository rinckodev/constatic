import type { ClientEventTypes } from "discord.js";

export type ClientEventKey = keyof ClientEventTypes;

export type EventPropData = {
    [Key in ClientEventKey]: {
        name: Key;
        args: ClientEventTypes[Key]
    }
}[ClientEventKey]

export interface EventData<EventName extends ClientEventKey> {
    name: string; 
    event: EventName; 
    once?: boolean; 
    tags?: string[];
    run(this: void, ...args: ClientEventTypes[EventName]): Promise<void>;
}

export class Event<EventName extends ClientEventKey> {
    constructor(
        public readonly data: EventData<EventName>
    ){}
}

export type GenericEventArgs = ClientEventTypes[ClientEventKey];
export type EventsCollection = Map<string, Event<ClientEventKey>>;

