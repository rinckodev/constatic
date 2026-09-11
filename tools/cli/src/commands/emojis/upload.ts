import { actions } from "#actions/index.js";
import { api } from "#shared/api.js";
import { resolveToken } from "#shared/token.js";
import { log } from "#utils/log.js";
import { createSpinner } from "#utils/spinner.js";
import { defineCommand } from "citty";
import { emojisArgs } from "./args.js";

export const uploadCommand = defineCommand({
    meta: {
        name: "upload",
        description: "Upload images to create app emojis"
    },
    args: {
        ...emojisArgs,
        overwrite: {
            type: "enum",
            options: ["all", "ask", "skip"],
            default: "all"
        },
        dir: {
            type: "positional",
            description: "Images directory path",
            required: true,
        }
    },
    async run({ args }){
        const spinner = createSpinner("🔍 Searching for files in nested folders...");
        const data = await actions.emojis.scan(args.dir);
        if (!data.length){
            spinner.fail("No images found in the given directory!");
            return;
        }
        spinner.update("Fetching token information...");
        const tokenResult = await resolveToken(args.token);
        if (!tokenResult.success){
            spinner.fail(tokenResult.error);
            return;
        }
        const token = tokenResult.data;
        spinner.update("Fetching current application emojis...");
        const emojisResult = await api.emojis.fetch(token.id, token.token);
        if (!emojisResult.success){
            spinner.fail(emojisResult.error);
            return;
        }
        const emojis = emojisResult.data;
        spinner.succeed(`Image files available for upload: ${data.length}`);

        await actions.emojis.upload({
            data, emojis, overwrite: args.overwrite, token
        });
        console.log();
        log.success("Uploading process completed!");
    }
});