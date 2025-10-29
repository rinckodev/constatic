import { commonTexts, divider, log, sleep, uiMessage } from "#helpers";
import { menus } from "#menus";
import { withDefaults } from "../../../../helpers/prompts.js";
import type { DiscordBotToken } from "#types";
import { select } from "@inquirer/prompts";
import ck from "chalk";
import { promptToken } from "./actions/prompt.js";
import { CLI } from "#cli";

export async function presetsTokensEditMenu(cli: CLI, tokens: DiscordBotToken[]) {
    const choices = tokens.map(token => ({
        name: `🤖 ${ck.yellow.underline(token.name)}`,
        value: token.id
    }));

    choices.unshift({
        name: commonTexts.back,
        value: "back",
    })

    const selected = await select(withDefaults({
        message: uiMessage({
            "en-US": "Select the token you want to edit",
            "pt-BR": "Selecione o token que deseja editar",
        }),
        choices,
    }));
    divider();


    if (selected === "back") {
        menus.presets.tokens.main(cli);
        return;
    }

    const result = await promptToken(tokens);
    if (!result.success) {
        log.error(result.error);
        await sleep(400);
        menus.presets.tokens.main(cli);
        return;
    }

    const index = tokens.findIndex(data => data.id === selected);
    tokens[index] = result.data;

    cli.config.set("discord.bot.tokens", tokens);

    log.success(uiMessage({
        "en-US": "Token edited successfully!",
        "pt-BR": "Token editado com sucesso!",
    }, ck.green));

    await sleep(400);
    menus.presets.tokens.main(cli);
}