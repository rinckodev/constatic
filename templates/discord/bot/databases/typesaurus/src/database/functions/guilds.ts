import { DatabaseSchema, db } from "#database";
import { Guild } from "discord.js";

export async function getGuildData(guild: Guild) {
    const guldDocument = await db.guilds.get(db.guilds.id(guild.id));
    return { guldDocument, data: guldDocument?.data };
}

type UpsetData = DatabaseSchema["guilds"]["AssignArg"];
export async function upsetGuildData(guild: Guild, data: UpsetData){
    return await db.guilds.upset(db.guilds.id(guild.id), data);
}

type UpdateData = DatabaseSchema["guilds"]["UpdateData"];
export async function updateGuildData(guild: Guild, data: UpdateData){
    return await db.guilds.update(db.guilds.id(guild.id), data);
}