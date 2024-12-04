import { cliTheme, getDiscordBotInfo, log, sleep, uiText } from "#helpers";
import { menus } from "#menus";
import { ProgramMenuProps } from "#types";
import { password } from "@inquirer/prompts";
import ck from "chalk";
import ora from "ora";

export async function settingsTokensNewMenu(props: ProgramMenuProps) {
    const token = await password({
        message: uiText(props.lang, {
           "en-US": "Insert your discord bot token",
           "pt-BR": "Insira seu token de bot de discord",
        }),
        theme: cliTheme,
        mask: "*",
        validate(value) {
            const message = uiText(props.lang, {
                "en-US": "You need to provide the token for your bot application.",
                "pt-BR": "É necessário informar o token da sua aplicação de bot",
            });
            if (!value){
                return message;
            }
            return true;
        },
    });

    const tokens = props.conf.get("discord.bot.tokens", []);
    const existing = tokens.find(t => t.token === token)
    if (existing){
        const name = `🤖 ${ck.yellow.underline(existing.name)}`;
        log.fail(uiText(props.lang, {
           "en-US": `This token is already saved! ${name}`,
           "pt-BR": `Este token já está salvo! ${name}`,
        }, ck.red));
        await sleep(500);
        menus.settings.tokens.main(props);
        return;
    }

    const fetching = ora();
    fetching.start(uiText(props.lang, {
        "en-US": "🔍 Fetching token information...",
        "pt-BR": "🔍 Buscando informações do token...",
     }));

    const result = await getDiscordBotInfo(token);
    fetching.stop();
    if (!result.success){
        log.error(uiText(props.lang, {
           "en-US": "The provided token is invalid",
           "pt-BR": "O token informado é inválido!",
        }, ck.red));
        await sleep(500);
        menus.settings.tokens.main(props);
        return;
    }
    const { name, invite, id } = result.data;
    
    tokens.push({ name, invite, id, token });

    props.conf.set("discord.bot.tokens", tokens);

    log.success(uiText(props.lang, {
       "en-US": "Token saved successfully!",
       "pt-BR": "Token salvo com sucesso!",
    }, ck.green));
    
    await sleep(500);
    menus.settings.tokens.main(props);
}