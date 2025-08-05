import { Collection } from "discord.js";
import { ClientEventKey, EventsCollection, GenericEventData } from "./types.js";
import { spaceBuilder } from "@magicyan/discord";
import chalk from "chalk";

export class EventManager {
    public readonly collection = new Collection<ClientEventKey, EventsCollection>()
    public readonly logs: string[] = [];

    public getEvents(key: ClientEventKey) {
        if (!this.collection.has(key)) {
            this.collection.set(key, new Collection());
        }
        return this.collection.get(key)!;
    }
    public add(data: GenericEventData) {
        const events = this.getEvents(data.event);
        events.set(data.name, data);
        return data;
    }
    public addLogs(data: GenericEventData) {
        this.logs.push(chalk.green(spaceBuilder(
            chalk.yellow(`☉ ${data.name}`),
            chalk.gray(">"),
            chalk.underline.yellowBright(data.event),
            "event ✓",
        )));
    }
}