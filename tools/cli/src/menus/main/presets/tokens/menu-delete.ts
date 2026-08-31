import { CLI } from "#cli";
import { divider, log, sleep, uiMessage } from "#helpers";
import { menus } from "#menus";
import type { DiscordBotToken } from "#types";
import { ck } from "#utils/ck.js";
import { checkbox } from "@inquirer/prompts";
import { withDefaults } from "../../../../helpers/prompts.js";

export async function presetsTokensDeleteMenu(cli: CLI, tokens: DiscordBotToken[]) {
    const choices = tokens.map(t => ({
        name: `🤖 ${ck.yellow.underline(t.name)}`, value: t.id
    }));

    const selected = await checkbox(withDefaults({
        message: uiMessage({
            "en-US": "Select the tokens you want to delete",
            "pt-BR": "Selecione os tokens que deseja deletar",
        }),
        choices,
        required: false,
    }));
    divider();


    if (selected.length < 1){
        log.warn(uiMessage({
           "en-US": "No token selected, back to tokens menu",
           "pt-BR": "Nenhum token selecionado, voltando ao menu de tokens",
        }))
        divider();
        await sleep(500);
        menus.presets.tokens.main(cli);
        return;
    }

    cli.config.set("discord.bot.tokens", 
        tokens.filter(t => !selected.includes(t.id))
    );

    log.success(uiMessage({
       "en-US": "Selected tokens removed successfully!",
       "pt-BR": "Tokens selecionados removidos com sucesso!",
    }, ck.green));
    divider();

    await sleep(500);
    menus.presets.tokens.main(cli);
}