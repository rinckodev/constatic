import type { ArgsDef } from "citty";

export const commandFlags = {
    database: {
        type: "string",
        alias: "db",
        description: "Database preset",
        default: "none",
    },
    server: {
        type: "string",
        description: "API server preset",
        default: "none",
    },
    token: {
        type: "string",
        description: "Saved token"
    },
    install: {
        type: "boolean",
        alias: "i",
        description: "Install dependencies?",
        default: false,
    },
    tsup: {
        type: "boolean",
        description: "Add tsup?",
        default: false,
    },
    discloud: {
        type: "boolean",
        description: "Add discloud files?",
        default: false
    },
} satisfies ArgsDef