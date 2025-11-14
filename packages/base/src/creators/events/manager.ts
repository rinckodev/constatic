import { Collection } from "discord.js";
import type { ClientEventKey, Event, EventsCollection } from "./event.js";

export class EventManager {
    public readonly collection = new Collection<ClientEventKey, EventsCollection>();
    public getEvents(key: ClientEventKey) {
        if (!this.collection.has(key)) {
            this.collection.set(key, new Map());
        }
        return this.collection.get(key)!;
    }
    public add(event: Event<ClientEventKey>){
        const events = this.getEvents(event.data.event);
        events.set(event.data.name, event);
    }
}