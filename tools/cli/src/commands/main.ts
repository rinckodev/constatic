import { menus } from "#menus";
import { defineCommand } from "citty";
import { CLI } from "../cli/index.js";
// import bot from "./bot/index.js"; SOON
import { divider } from "#helpers";
import { ck } from "#utils/ck.js";

export default function (cli: CLI) {
    return defineCommand({
        meta: {
            name: cli.pkg.name,
            description: cli.pkg.description,
            version: cli.pkg.version,
        },
        // SOON
        // subCommands: {
        //     bot: bot(cli),
        // },
        setup() {
            console.log(
                ck.blue("💎 Constatic CLI"), "📦",
                ck.dim.underline(cli.pkg.version),
            );
            divider();
        },
        async run({ args }) {
            if (args._.length > 0) return;
            await menus.main();
        },
    })
}