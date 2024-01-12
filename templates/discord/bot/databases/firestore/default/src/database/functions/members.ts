import { db } from "#database";
import { GuildMember } from "discord.js";

export async function getMemberData(member: GuildMember){
    return await db.get(db.members(member.guild.id), member.id) ?? {}
}