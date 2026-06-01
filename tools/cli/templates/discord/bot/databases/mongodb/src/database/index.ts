import { env } from "#env";
import { MongoClient } from "mongodb";
import { styleText } from "node:util";
import { createGuildModel } from "./schemas/guilds.js";
import { createMemberModel } from "./schemas/members.js";

console.log(styleText("blue", "Connecting to MongoDB..."));
const connection = await MongoClient.connect(env.MONGO_URI);
const database = connection.db(env.DATABASE_NAME ?? "database");
console.log(styleText("green", "MongoDB connected ✓"));

export const db = Object.freeze({
    guilds: createGuildModel(database),
    members: createMemberModel(database)
});

export type { GuildData } from "./schemas/guilds.js";
export type { MemberData } from "./schemas/members.js";

