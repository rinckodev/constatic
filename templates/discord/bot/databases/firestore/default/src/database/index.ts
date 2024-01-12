import * as typesaurus from "typesaurus";
import { GuildDocument } from "./documents/GuildDocument.js";
import { MemberDocument } from "./documents/MemberDocument.js";
import firebase from "firebase-admin";
import { firebaseAccount } from "#settings";

firebase.initializeApp({ credential: firebase.credential.cert(firebaseAccount) });

const db = {
    guilds: typesaurus.collection<GuildDocument>("guilds"),
    members: (guildId: string) => typesaurus.collection<MemberDocument>(`guilds/${guildId}/members`),
    ...typesaurus,
    async get<Model>(collection: typesaurus.Collection<Model>, id: string){
        const { data } = await typesaurus.get(collection, id) ?? {};
        return data;
    },
    getFull: typesaurus.get
}

export { db };

export * from "./documents/GuildDocument.js";
export * from "./documents/MemberDocument.js";

export * from "./functions/guilds.js"
export * from "./functions/members.js"