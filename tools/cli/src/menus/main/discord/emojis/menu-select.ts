import { CLI } from "#cli";
import { commonTexts, divider, log, sleep, uiMessage, withDefaults } from "#helpers";
import { KeyValueFile } from "#lib/kvf.js";
import { menus } from "#menus";
import { fetchDiscordTokenData } from "#shared/tokens.js";
import { select } from "@inquirer/prompts";
import ck from "chalk";
import { glob } from "tinyglobby";

type ChoiceData = { name: string, value: string | number };

export async function selectDiscordBot(cli: CLI) {
    const tokens = cli.config.get("discord.bot.tokens", []);

    const choices: ChoiceData[] = tokens.map((token, index) => ({
        name: `${ck.green("●")} ${ck.blue(token.name)}`,
        value: index,
    }));

    const paths = await glob("./.env*", { cwd: process.cwd() });

    const envs = await Promise.all(
        paths.map(async filepath => {
            const env = new KeyValueFile(filepath);
            await env.read();
            return { name: filepath, vars: env.record }
        })
    )
        .then(envs => envs.filter(
            ({ vars }) => "BOT_TOKEN" in vars && !!vars.BOT_TOKEN
        ));

    choices.unshift(...envs.map(data => ({
        name: uiMessage({
            "en-US": `▲ Use ${ck.underline(data.name)} file BOT_TOKEN`,
            "pt-BR": `▲ Use o BOT_TOKEN do arquivo ${ck.underline(data.name)}`,
        }, ck.yellow),
        value: data.vars.BOT_TOKEN,
    })));

    choices.unshift({
        name: uiMessage({
            "en-US": "✦ New temporary application",
            "pt-BR": "✦ Nova aplicação temporária",
        }, ck.green),
        value: -2,
    })

    choices.push({ name: commonTexts.back, value: -1 });

    const index = await select(withDefaults({
        message: uiMessage({
            "en-US": "Select an application",
            "pt-BR": "Selecione uma aplicação",
        }),
        choices
    }));
    divider();

    const onTokenNotFound = async (error: string) => {
        log.error(error);
        divider();
        await sleep(400);
        selectDiscordBot(cli);
    }

    const fetchTokenOperation = async (token: string) => {
        const result = await fetchDiscordTokenData(token);
        if (!result.success) {
            onTokenNotFound(result.error);
            return;
        }
        menus.discord.emojis.main(cli, result.data);
    }

    if (typeof index === "string") {
        await fetchTokenOperation(index);
        return;
    }

    if (index === -1) {
        menus.main(cli)
        return;
    }
    if (index === -2) {
        const result = await menus.presets.tokens.prompts.token(tokens);
        divider();
        if (!result.success) {
            onTokenNotFound(result.error);
            return;
        }
        menus.discord.emojis.main(cli, result.data);
        return;
    }
    menus.discord.emojis.main(cli, tokens[index]);
}