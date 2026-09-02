import { menus } from "#menus";
import { defineCommand } from "citty";
// import bot from "./bot/index.js"; SOON
import { ck } from "#utils/ck.js";
import { pkg } from "#utils/pkg.js";

export default function () {
    return defineCommand({
        meta: {
            name: pkg.name,
            description: pkg.description,
            version: pkg.version,
        },
        // SOON
        // subCommands: {
        //     bot: bot(cli),
        // },
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
    })
}