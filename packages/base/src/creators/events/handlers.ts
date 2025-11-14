import type { Client } from "discord.js";
import { ConstaticApp } from "../../app.js";
import type { ClientEventKey, Event, EventPropData, GenericEventArgs } from "./event.js";

export abstract class BaseEventHandlers {
    public static async onEvent(event: Event<ClientEventKey>, args: GenericEventArgs) {
        const app = ConstaticApp.getInstance();

        const { middleware, onError } = app.config.events;

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
            app.events.getEvents(event.data.event)?.delete(event.data.name);
        };
    }
    public static register(client: Client) {
        const app = ConstaticApp.getInstance();
        const collection = app.events.collection.filter(
            (_, key) => key !== "clientReady"
        );

        for (const [key, events] of collection.entries()) {
            client.on(key, (...args) => {
                Promise.all(Array.from(events.values()).map(event =>
                    BaseEventHandlers.onEvent(event, args)
                ))
            });
        }
    }
    public static async runReady(client: Client<true>){
        const app = ConstaticApp.getInstance();
        const collection = app.events.getEvents("clientReady");

        await Promise.all(
            Array.from(collection.values())
                .map(event => BaseEventHandlers.onEvent(event, [client]))
        );
    }
}
