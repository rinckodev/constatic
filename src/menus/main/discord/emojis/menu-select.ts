import { commonTexts, divider, log, parseEnvFile, sleep, uiMessage } from "#helpers";
import { menus } from "#menus";
import { withDefaults } from "#prompts";
import { fetchDiscordTokenData } from "#shared/tokens.js";
import { ProgramMenuProps } from "#types";
import { select } from "@inquirer/prompts";
import { glob } from "@reliverse/reglob";
import ck from "chalk";

type ChoiceData = { name: string, value: string | number };

export async function selectDiscordBot(props: ProgramMenuProps) {
    const tokens = props.conf.get("discord.bot.tokens", []);

    const choices: ChoiceData[] = tokens.map((token, index) => ({
        name: `${ck.green("●")} ${ck.blue(token.name)}`,
        value: index,
    }));

    const paths = await glob("./.env*", { cwd: props.cwd });

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
        name: uiMessage({
            "en-US": `▲ Use ${ck.underline(data.name)} file BOT_TOKEN`,
            "pt-BR": `▲ Use o BOT_TOKEN do arquivo ${ck.underline(data.name)}`,
        }, ck.yellow),
        value: data.vars.BOT_TOKEN,
    })))

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
        selectDiscordBot(props);
    }

    const fetchTokenOperation = async (token: string) => {
        const result = await fetchDiscordTokenData(token);
        if (!result.success) {
            onTokenNotFound(result.error);
            return;
        }
        menus.discord.emojis.main(props, result.data);
    }

    if (typeof index === "string") {
        await fetchTokenOperation(index);
        return;
    }

    if (index === -1) {
        menus.main(props)
        return;
    }
    if (index === -2) {
        const result = await menus.presets.tokens.prompts.token(tokens);
        divider();
        if (!result.success) {
            onTokenNotFound(result.error);
            return;
        }
        menus.discord.emojis.main(props, result.data);
        return;
    }
    menus.discord.emojis.main(props, tokens[index]);
}