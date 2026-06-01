import type { GuildMember } from "discord.js";
import type { Db, WithId } from "mongodb";

export interface MemberData {
    id: string;
    guildId: string;
    wallet?: {
        coins?: number
    }
}

export function createMemberModel(db: Db){
    const collection = db.collection<MemberData>("members");
    return Object.assign(collection, {
        async create(data: MemberData){
            const result = await collection.insertOne(data);
            return {...data, _id: result.insertedId }
        },
        async get(member: Pick<GuildMember, "id" | "guild">): Promise<WithId<MemberData>> {
            const query = { id: member.id, guildId: member.guild.id };
            const doc = await collection.findOne(query) 
            if (doc) return doc;
            return await this.create(query);
        }
    })
}