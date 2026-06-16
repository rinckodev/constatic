import { Schema } from "mongoose";
import { t } from "../utils.js";

export const memberSchema = new Schema(
    {
        id: t.string,
        guildId: t.string,
        wallet: {
            coins: { type: Number, default: 0 },
        }
    },
    {
        statics: {
            async get(member: { id: string, guild: { id: string } }) {
                const query = { id: member.id, guildId: member.guild.id };
                return await this.findOneAndUpdate(
                    query, { $setOnInsert: query },
                    { returnDocument: "after", upsert: true }
                );
            }
        }
    },
);