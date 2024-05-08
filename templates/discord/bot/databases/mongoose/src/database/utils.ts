import { Schema } from "mongoose";

export const p = {
   string: { type: String, required: true },
   number: { type: Number, required: true },
   boolean: { type: Boolean, required: true },
   date: { type: Date, required: true },
};

export const t = Object.assign(p, {
   channelInfo: new Schema({ id: p.string, url: p.string }, { _id: false }),
   roleInfo: new Schema({ id: p.string }, { _id: false }),
});