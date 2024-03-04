import { Schema } from "mongoose";
import { t } from "../utils.js";

const channelType = { id: t.string, url: t.string };

export const guildSchema = new Schema(
   {
      id: t.string,
      channels: {
         logs: channelType,
         general: channelType
      }
   },
   {
      statics: {
         async get(id: string) {
            const doc = await this.findOne({ id });
            return doc ?? this.create({ id });
         }
      }
   }
);