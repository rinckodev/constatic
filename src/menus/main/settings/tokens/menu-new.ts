import { cliTheme, log, sleep, uiText } from "#helpers";
import { menus } from "#menus";
import { fetchDiscordTokenData } from "#shared/tokens.js";
import { Language, ProgramMenuProps } from "#types";
import { password } from "@inquirer/prompts";
import ck from "chalk";

export async function settingsTokensNewMenu(props: ProgramMenuProps) {
    const token = await promptToken(props.lang);

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

    const result = await fetchDiscordTokenData(token, props.lang);
    if (!result.success){
        log.error(result.error);
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

export async function promptToken(lang: Language){
    return await password({
        message: uiText(lang, {
           "en-US": "Insert your discord bot token",
           "pt-BR": "Insira seu token de bot de discord",
        }),
        theme: cliTheme,
        mask: "*",
        validate(value) {
            const message = uiText(lang, {
                "en-US": "You need to provide the token for your bot application.",
                "pt-BR": "É necessário informar o token da sua aplicação de bot",
            });
            return !value ? message : true;
        },
    });
}