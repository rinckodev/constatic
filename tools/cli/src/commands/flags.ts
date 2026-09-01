export const commandFlags = {
    database: {
        type: "string",
        alias: "db",
        description: "Database preset"
    },
    server: {
        type: "string",
        alias: "sv",
        description: "API server preset"
    },
    token: {
        type: "string",
        alias: "tk",
        description: "Saved token"
    },
    install: {
        type: "boolean",
        alias: "i",
        description: "Install dependencies?"
    },
    tsup: {
        type: "boolean",
        alias: "t",
        description: "Add tsup?"
    },
    discloud: {
        type: "boolean",
        alias: "d",
        description: "Add discloud files?"
    },
} as const