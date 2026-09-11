import { actions } from "#actions/index.js";
import { api } from "#shared/api.js";
import { resolveToken } from "#shared/token.js";
import { log } from "#utils/log.js";
import { defineCommand } from "citty";
import { emojisArgs } from "./args.js";

export const fileCommand = defineCommand({
    meta: {
        name: "file",
        description: "Generate emojis file"
    },
    args: {
        ...emojisArgs,
        type: {
            type: "enum",
            options: ["id", "url"],
            default: "id"
        },
        path: {
            type: "positional",
            description: "File path destination",
            required: true,
        }
    },
    async run({ args }) {
        const dist = args.path;
        if (!dist.endsWith(".json")){
            log.error("The file extension must be .json.");
            return;
        }
        const result = await resolveToken(args.token);
        if (!result.success){
            log.error(result.error);
            return;
        }
        const emojis = await api.emojis.fetch(result.data.id, result.data.token);
        if (!emojis.success){
            log.error(emojis.error);
            return;
        }
        const writeResult = await actions.emojis.file({
            dist,
            emojis: emojis.data,
            type: args.type
        });
        if (!writeResult.success){
            log.error(writeResult.error);
            return;
        }
        log.success(writeResult.data);
    }
});