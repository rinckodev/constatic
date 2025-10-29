import { actions } from "#actions/index.js";
import { CLI } from "#cli";
import { l } from "#helpers";
import { fetchDiscordTokenData } from "#shared/tokens.js";
import { defineCommand } from "citty";

export default function (cli: CLI) {
    return defineCommand({
        meta: {
            name: "list",
            description: l({
                "pt-BR": "Listar todos os emojis da aplicação",
                "en-US": "List all emojis in the app",
            })
        },
        args: {
            token: {
                type: "string",
                description: l({
                    "pt-BR": "Nome do token salvo ou o token completo",
                    "en-US": "Saved token name or full token",
                }),
                alias: "tk",
                required: true,
            },
            // type: {
            //     type: "string",
            //     alias: "t",
            //     description: l({
            //         "pt-BR": "Tipo de emoji da aplicação",
            //         "en-US": "Application emoji type",
            //     }),
            //     valueHint: "animated | a | static | s",
            // }
        },
        async run({ args }) {
            
            const data = {
                token: args.token ?? args.tk,
                type: args.type ?? args.t
            }

            let token = cli.config.getToken(data.token);

            if (!token){
                const result = await fetchDiscordTokenData(data.token);
                if (!result.success){
                    console.error(result.error);
                    process.exit(1);
                }
                token=result.data;
            }

            await actions.emojis.list(cli, { token });
            
        },
    })
}