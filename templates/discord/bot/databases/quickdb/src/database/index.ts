import { QuickDB } from "quick.db";
import { GuildData } from "./interfaces/GuildData.js";
import { MemberData } from "./interfaces/MemberData.js";

const filePath = rootTo("localdb.sqlite");

const db = {
    guilds: new QuickDB<GuildData>({ filePath, table: "guilds" }),
    members: new QuickDB<MemberData>({ filePath, table: "members" })
};

export { db };