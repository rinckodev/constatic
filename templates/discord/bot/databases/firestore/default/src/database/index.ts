import firebase from "firebase-admin";
import { firebaseAccount } from "#settings";
import { schema, Typesaurus } from "typesaurus";
import { GuildDocument } from "./documents/GuildDocument.js";
import { MemberDocument } from "./documents/MemberDocument.js";

firebase.initializeApp({ credential: firebase.credential.cert(firebaseAccount) });

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