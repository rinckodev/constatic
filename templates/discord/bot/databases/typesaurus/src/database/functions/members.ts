import { DatabaseSchema,  db } from "#database";
import { GuildMember } from "discord.js";

export async function getMemberData(member: GuildMember){
    const memberDocument = await db.guilds(db.guilds.id(member.guild.id))
    .members.get(db.guilds.sub.members.id(member.id));
    return { memberDocument, memberData: memberDocument?.data };
}

type UpsetData = DatabaseSchema["guilds"]["sub"]["members"]["AssignArg"];
export async function upsetMemberData(member: GuildMember, data: UpsetData){
    return await db.guilds(db.guilds.id(member.guild.id))
    .members.upset(db.guilds.sub.members.id(member.id), data);
}

type UpdateData = DatabaseSchema["guilds"]["sub"]["members"]["UpdateData"];
export async function updateMemberData(member: GuildMember, data: UpdateData){
    return await db.guilds(db.guilds.id(member.guild.id))
    .members.update(db.guilds.sub.members.id(member.id), data);
}

