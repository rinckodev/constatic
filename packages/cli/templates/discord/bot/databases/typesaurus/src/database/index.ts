import { env } from "#env";
import { cert, initializeApp } from "firebase-admin/app";
import fs from "node:fs";
import { schema, Typesaurus } from "typesaurus";
import { GuildDocument } from "./documents/GuildDocument.js";
import { MemberDocument } from "./documents/MemberDocument.js";

const accountFile = fs.readFileSync(env.FIREBASE_PATH, { 
    encoding: "utf-8" 
});

initializeApp({
    credential: cert(JSON.parse(accountFile))
});

export const db = schema(({ collection }) => ({
    guilds: collection<GuildDocument>().sub({
        members: collection<MemberDocument>()
    })
}));

export type DatabaseSchema = Typesaurus.Schema<typeof db>;
export type MemberSchema = DatabaseSchema["guilds"]["sub"]["members"]["Data"];
export type GuildSchema = DatabaseSchema["guilds"]["Data"];

export * from "./functions/guilds.js";
export * from "./functions/members.js";