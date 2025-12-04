import { l } from "#helpers";

export const commandFlags = {
    database: {
        type: "string",
        alias: "db",
        description: l({
            "pt-BR": "Predefinição de banco de dados",
            "en-US": "Database preset",
        })
    },
    server: {
        type: "string",
        alias: "sv",
        description: l({
            "pt-BR": "Predefinição de servidor http",
            "en-US": "Http server preset",
        })
    },
    token: {
        type: "string",
        alias: "tk",
        description: l({
            "pt-BR": "Token salvo",
            "en-US": "Saved token",
        })
    },
    install: {
        type: "boolean",
        alias: "i",
        description: l({
            "pt-BR": "Instalar dependências?",
            "en-US": "Install dependencies?",
        })
    },
    tsup: {
        type: "boolean",
        alias: "t",
        description: l({
            "pt-BR": "Adicionar tsup?",
            "en-US": "Add tsup?",
        })
    },
    discloud: {
        type: "boolean",
        alias: "d",
        description: l({
            "pt-BR": "Adicionar arquivos discloud?",
            "en-US": "Add discloud files?",
        })
    },
} as const