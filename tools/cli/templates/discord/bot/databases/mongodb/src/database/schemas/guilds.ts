import type { Db, WithId } from "mongodb";

export interface GuildData {
    id: string;
    webhooks?: {
        logs?: string;
        announcements?: string;
    }
    channels?: {
        general?: string;
    }
}

export function createGuildModel(db: Db){
    const collection = db.collection<GuildData>("guilds");
    return Object.assign(collection, {
        async create(data: GuildData){
            const result = await collection.insertOne(data);
            return {...data, _id: result.insertedId }
        },
        async get(id: string): Promise<WithId<GuildData>> {
            const doc = await collection.findOne({ id }) 
            if (doc) return doc;
            return await this.create({ id });
        }
    })
}