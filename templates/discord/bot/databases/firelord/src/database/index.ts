import { getFirelord, getFirestore } from "firelord";
import { cert, initializeApp } from "firebase-admin/app";

import fs from "node:fs";
import { env } from "#env";

import { GuildDocument } from "./documents/GuildDocument.js";
import { MemberDocument } from "./documents/MemberDocument.js";

const accountFile = fs.readFileSync(env.FIREBASE_PATH, { 
    encoding: "utf-8" 
});

const app = getFirestore(initializeApp({
    credential: cert(JSON.parse(accountFile))
}));

export const db = {
    guildsRef: getFirelord<GuildDocument>(app, "guilds"),
    membersRef: getFirelord<MemberDocument>(app, "guilds", "members"),
    guilds(id: string){
        return this.guildsRef.doc(id);
    },
    members(member: { guild: { id: string }, id: string }){
        return this.membersRef.doc(member.guild.id, member.id);
    }
};