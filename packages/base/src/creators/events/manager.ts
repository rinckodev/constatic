import { Client, Collection, type ClientEventTypes } from "discord.js";
import { BaseManager } from "../manager.js";
import type { ClientEventKey, Event, EventPropData, EventsCollection, GenericEventArgs } from "./event.js";

export class EventManager extends BaseManager {
    private get config(){
        return this.app.config.events;
    }
    public readonly collection = new Collection<ClientEventKey, EventsCollection>();
    public getEvents(key: ClientEventKey) {
        if (!this.collection.has(key)) {
            this.collection.set(key, new Map());
        }
        return this.collection.get(key)!;
    }
    public add(event: Event<ClientEventKey>) {
        const events = this.getEvents(event.data.event);
        events.set(event.data.name, event);
    }
    public async onEvent(event: Event<ClientEventKey>, args: GenericEventArgs) {
        const { middleware, onError } = this.config;

        let isBlock = false;
        const block = (...selected: string[]) => {
            const tags = event.data.tags ?? [];
            if (selected.length === 0) {
                isBlock = tags.length === 0;
                return;
            }
            isBlock = selected.some(tag => tags.includes(tag));
        }

        const eventData = { name: event.data.name, args } as EventPropData;

        if (middleware) await middleware(eventData, block);
        if (isBlock) return;

        await event.data.run(...args)
            .catch(err => {
                if (onError) {
                    onError(err, eventData);
                    return;
                }
                throw err;
            });

        if (event.data.once) {
            this.getEvents(event.data.event)?.delete(event.data.name);
        };
    }
    public register(client: Client) {
        const collection = this.collection.filter(
            (_, key) => key !== "clientReady"
        );

        for (const [key, events] of collection.entries()) {
            client.on(key, (...args: ClientEventTypes[keyof ClientEventTypes]) => {
                Promise.all(Array.from(events.values()).map(event =>
                    this.onEvent(event, args)
                ))
            });
        }
    }
    public async runReady(client: Client<true>) {
        const collection = this.getEvents("clientReady");

        await Promise.all(
            Array.from(collection.values())
                .map(event => this.onEvent(event, [client]))
        );
    }
}