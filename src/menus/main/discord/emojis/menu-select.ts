import { cliTheme, commonTexts, divider, log, parseEnvFile, sleep, uiText } from "#helpers";
import { menus } from "#menus";
import { fetchDiscordTokenData } from "#shared/tokens.js";
import { ProgramMenuProps } from "#types";
import { select } from "@inquirer/prompts";
import ck from "chalk";
import fg from "fast-glob";

type ChoiceData = { name: string, value: string | number };

export async function selectDiscordBot(props: ProgramMenuProps) {
    const tokens = props.conf.get("discord.bot.tokens", []);

    const choices: ChoiceData[] = tokens.map((token, index) => ({
        name: `${ck.green("●")} ${ck.blue(token.name)}`,
        value: index,
    }));

    const paths = await fg("./.env*", { cwd: props.cwd });

    const envs = await Promise.all(
        paths.map(async filepath => {
            const vars = await parseEnvFile(filepath);
            return { name: filepath, vars }
        })
    )
    .then(envs => envs.filter(
        ({ vars }) => "BOT_TOKEN" in vars && !!vars.BOT_TOKEN
    ));

    choices.unshift(...envs.map(data => ({
        name: uiText(props.lang, {
            "en-US": `▲ Use ${ck.underline(data.name)} file BOT_TOKEN`,
            "pt-BR": `▲ Use o BOT_TOKEN do arquivo ${ck.underline(data.name)}`,
        }, ck.yellow),
        value: data.vars.BOT_TOKEN, 
    })))

    choices.unshift({
        name: uiText(props.lang, {
            "en-US": "✦ New temporary application",
            "pt-BR": "✦ Nova aplicação temporária",
        }, ck.green),
        value: -2,
    })

    choices.push({ name: commonTexts(props.lang).back, value: -1 });

    const index = await select({
        message: uiText(props.lang, {
            "en-US": "Select an application",
            "pt-BR": "Selecione uma aplicação",
        }),
        theme: cliTheme,
        choices
    });
    divider();

    const fetchTokenOperation = async (token: string) => {
        const result = await fetchDiscordTokenData(token, props.lang);
        if (!result.success) {
            log.error(result.error);
            divider();
            await sleep(500);
            selectDiscordBot(props);
            return;
        }
        menus.discord.emojis.main(props, result.data);
    }

    if (typeof index === "string"){
        await fetchTokenOperation(index);
        return;
    }

    if (index === -1) {
        menus.main(props)
        return;
    }
    if (index === -2) {
        const token = await menus.settings.tokens.prompts.token(props.lang);
        divider();
        await fetchTokenOperation(token);
        return;
    }
    menus.discord.emojis.main(props, tokens[index]);
}