import { menus } from "#menus";
import { ck } from "#utils/ck.js";
import { pkg } from "#utils/pkg.js";
import { defineCommand } from "citty";
import { botCommand } from "./bot/index.js";
import { emojisCommand } from "./emojis/index.js";

export const mainCommand = defineCommand({
    meta: {
        name: pkg.name,
        description: pkg.description,
        version: pkg.version,
    },
    subCommands: {
        bot: botCommand,
        emojis: emojisCommand,
    },
    setup() {
        console.log(
            ck.blue("💎 Constatic CLI"), "📦",
            ck.dim.underline(pkg.version),
        );
        console.log();
    },
    async run({ args }) {
        if (args._.length > 0) return;
        menus.main();
    },
});