import { Delete, MetaTypeCreator } from "firelord";
import { GuildDocument } from "./GuildDocument.js";

export type MemberDocument = MetaTypeCreator<
    {
        wallet: {
            coins: number | Delete
        } | Delete
    },
    "members", string, GuildDocument, { allFieldsPossiblyReadAsUndefined: true }
>
