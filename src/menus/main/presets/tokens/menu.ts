import { commonTexts, divider, log, sleep, uiMessage } from "#helpers";
import { menus } from "#menus";
import { select } from "@inquirer/prompts";
import { ProgramMenuProps } from "#types";
import ck from "chalk";
import { withDefaults } from "#prompts";

export async function presetsTokensMenu(props: ProgramMenuProps) {
    const action = await select(withDefaults({
        message: uiMessage({
            "pt-BR": "❑ Gerenciar tokens",
            "en-US": "❑ Manage tokens",
        }, ck.reset.cyan.underline),
        choices: [
            {
                name: uiMessage({
                    "en-US": "✦ New token",
                    "pt-BR": "✦ Novo token",
                }, ck.green),
                value: "new"
            },
            {
                name: uiMessage({
                    "en-US": "☰ List tokens",
                    "pt-BR": "☰ Listar tokens",
                }, ck.blue),
                value: "list"
            },
            {
                name: uiMessage({
                    "en-US": "✎ Edit token",
                    "pt-BR": "✎ Editar token",
                }, ck.yellowBright),
                value: "edit"
            },
            {
                name: uiMessage({
                    "en-US": "✗ Delete tokens",
                    "pt-BR": "✗ Excluir tokens",
                }, ck.red),
                value: "delete"
            },
            {
                name: commonTexts.back,
                value: "back"
            },
        ]
    }));
    divider();

    const tokens = props.conf.get("discord.bot.tokens", []);
    switch(action){
        case "back":{
            menus.main(props);
            return;
        }
        case "new": {
            menus.presets.tokens.new(props, tokens);
            return;
        }
    }

    if (!tokens.length){
        log.fail(uiMessage({
            "en-US": "No tokens to list",
            "pt-BR": "Nenhum token para listar",
        }));
        await sleep(400);
        menus.presets.tokens.main(props);
        return;
    }

    switch (action) {
        case "list": {
            menus.presets.tokens.list(props, tokens);
            return;
        }
        case "edit": {
            menus.presets.tokens.edit(props, tokens);
            return;
        }
        case "delete": {
            menus.presets.tokens.delete(props, tokens);
            return;
        }
    }

}