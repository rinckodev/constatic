import { defineCommand } from "citty";
import { addCommand } from "./add.js";
import { initCommand } from "./init.js";

export const botCommand = defineCommand({
    meta: {
        name: "bot",
        description: "Init or manage discord bot projects",
    },
    subCommands: {
        init: initCommand,
        add: addCommand,
    }
});