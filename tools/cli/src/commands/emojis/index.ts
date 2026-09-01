import { defineCommand } from "citty";

export default function () {
    return defineCommand({
        meta: {
            name: "emojis",
            description: "Manage discord application emojis"
        },
        subCommands: {
            // list: list(cli)
        }
    })
}
