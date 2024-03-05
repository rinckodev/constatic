import firebase from "firebase-admin";
import { MemberDocument } from "./documents/MemberDocument.js";
import { GuildDocument } from "./documents/GuildDocument.js";
import { schema, Typesaurus } from "typesaurus";
import { log } from "#settings";
import path from "node:path";
import chalk from "chalk";
import fs from "node:fs";

const firebaseAccountPath = rootTo(process.env.FIREBASE_PATH);

if (!fs.existsSync(firebaseAccountPath)){
    const filename = chalk.yellow(`"${path.basename(firebaseAccountPath)}"`);
    const text = chalk.red(`The ${filename} file was not found in ${__rootname}`);
    log.error(text);
    process.exit(0);
}

const firebaseAccount: firebase.ServiceAccount = JSON.parse(
    fs.readFileSync(firebaseAccountPath, { encoding: "utf-8" })
);


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