import ck from "chalk";
import { CLI } from "../cli/index.js";
import { defineCommand } from "citty";
import { menus } from "#menus";
// import bot from "./bot/index.js"; SOON
import { divider } from "#helpers";

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
            menus.main(cli);
        },
    })
}