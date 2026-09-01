import { defineCommand } from "citty";
import add from "./add.js";
import init from "./init.js";

export default function () {
    return defineCommand({
        meta: {
            name: "bot",
            description: "Init and manage discord bot projects",
        },
        subCommands: {
            init: init(),
            add: add(),
        }
    })
}
