import { getFirelord, getFirestore } from "firelord";
import { cert, initializeApp } from "firebase-admin/app";

import fs from "node:fs";
import chalk from "chalk";
import path from "node:path";
import { logger } from "#base";
import { env } from "#env";

import { GuildDocument } from "./documents/GuildDocument.js";
import { MemberDocument } from "./documents/MemberDocument.js";

if (!fs.existsSync(env.FIREBASE_PATH)){
    const filename = chalk.yellow(`"${path.basename(env.FIREBASE_PATH)}"`);
    const text = chalk.red(`The ${filename} file was not found in ${process.cwd()}`);
    logger.error(text);
    process.exit(0);
}

const firebaseAccount = JSON.parse(
    fs.readFileSync(env.FIREBASE_PATH, { encoding: "utf-8" })
);


const app = getFirestore(initializeApp({ credential: cert(firebaseAccount) })); 

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