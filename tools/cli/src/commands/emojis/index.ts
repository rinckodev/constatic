import { menus } from "#menus";
import { defineCommand } from "citty";
import { clearCommand } from "./clear.js";
import { fileCommand } from "./file.js";
import { listCommand } from "./list.js";
import { uploadCommand } from "./upload.js";

export const emojisCommand = defineCommand({
    meta: {
        name: "emojis",
        description: "Application emojis management commands"
    },
    subCommands: {
        file: fileCommand,
        list: listCommand,
        clear: clearCommand,
        upload: uploadCommand
    },
    async run({ args }){
        if (args._.length >= 1) return;
        menus.emojis.main();
    }
});