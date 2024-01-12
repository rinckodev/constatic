import { db } from "#database";

export async function getGuildData(id: string) {
    return await db.get(db.guilds, id) ?? {}
}