import { Schema } from "mongoose";
import { t } from "../utils.js";

export const guildSchema = new Schema(
    {
        id: t.string,
        channels: {
            logs: String,
            general: String,
        }
    },
    {
        statics: {
            async get(id: string) {
                const query = { id };
                return await this.findOneAndUpdate(
                    query, { $setOnInsert: query },
                    { returnDocument: "after", upsert: true }
                );
            }
        }
    }
);