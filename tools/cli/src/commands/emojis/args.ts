import type { ArgsDef } from "citty";

export const emojisArgs = {
    token: {
        type: "string",
        description: "Discord application token (alias | inline | .env path)",
        required: true
    }
} satisfies ArgsDef;