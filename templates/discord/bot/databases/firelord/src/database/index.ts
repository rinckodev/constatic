import fs from "node:fs";
import chalk from "chalk";
import { env, logger } from "#settings";
import path from "node:path";

const firebaseAccountPath = rootTo(env.FIREBASE_PATH);

if (!fs.existsSync(firebaseAccountPath)){
    const filename = chalk.yellow(`"${path.basename(firebaseAccountPath)}"`);
    const text = chalk.red(`The ${filename} file was not found in ${__rootname}`);
    logger.error(text);
    process.exit(0);
}

const firebaseAccount = JSON.parse(
    fs.readFileSync(firebaseAccountPath, { encoding: "utf-8" })
);

import { getFirelord, getFirestore } from "firelord";
import { cert, initializeApp } from "firebase-admin/app";

import { GuildDocument } from "./documents/GuildDocument.js";
import { MemberDocument } from "./documents/MemberDocument.js";

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