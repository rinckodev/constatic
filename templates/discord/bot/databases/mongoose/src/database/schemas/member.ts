import { GuildMember } from "discord.js";
import { Schema } from "mongoose";
import { t } from "../utils.js";

export const memberSchema = new Schema(
    {
      id: t.string,
      guildId: t.string,
      wallet: {
        coins: { type: Number, required: false, default: 0 },
      }
    },
    {
      statics: {
        async getById(id: string, guildId: string) {
          return this.findOne({ id, guildId });
        },
        async get(member: GuildMember) {
          const { id, guild: { id: guildId } } = member;
          const doc = await this.findOne({ id, guildId });
          return doc ?? this.create({ id, guildId });
        }
      }
    },
);