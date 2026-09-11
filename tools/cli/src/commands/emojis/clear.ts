import { actions } from "#actions/index.js";
import { api } from "#shared/api.js";
import { resolveToken } from "#shared/token.js";
import { log } from "#utils/log.js";
import { defineCommand } from "citty";
import { emojisArgs } from "./args.js";

export const clearCommand = defineCommand({
    meta: {
        name: "clear",
        description: "Clear all app emojis"
    },
    args: {
        ...emojisArgs
    },
    async run({ args }) {
        const result = await resolveToken(args.token);
        if (!result.success){
            log.error(result.error);
            return;
        }
        const emojis = await api.emojis.fetch(
            result.data.id, result.data.token
        );
        if (!emojis.success){
            log.error(emojis.error);
            return;
        }
        if (emojis.data.length < 1){
            log.warn("No emojis to delete!");
            return;
        }
        await actions.emojis.delete({
            emojis: emojis.data,
            token: result.data
        });
        console.log();
        log.success("Clear emojis process completed!");
    }
});